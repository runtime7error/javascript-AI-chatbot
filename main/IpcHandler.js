const { ipcMain } = require("electron");

ipcMain.on("send-message-stream", async (event, userMessage) => {
  const {
    addUserMessage,
    addAssistantMessage,
    buildPrompt,
  } = require("../utils/ContextManager");

  console.log("[IPC] → received userMessage:", userMessage);
  addUserMessage(userMessage);

  const prompt = buildPrompt();
  console.log("[IPC] → fullPrompt length (chars):", prompt.length);

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b-it-qat",
        prompt,
        max_tokens: 60,
        temperature: 0.3,
        top_p: 0.9,
        stream: true,
      }),
    });

    const reader = res.body.getReader();
    let partial = "";
    let fullMessage = "";

    event.sender.send("stream-start");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      partial += chunk;

      const lines = partial.split("\n");
      partial = lines.pop();

      for (const line of lines) {
        if (line.trim()) {
          try {
            const jsonChunk = JSON.parse(line);

            if (jsonChunk.response) {
              fullMessage += jsonChunk.response;
            }

            event.sender.send("stream-chunk", line);

            if (jsonChunk.done) {
              console.log("[IPC] → stream completed");
              break;
            }
          } catch (parseError) {
            console.warn("[IPC] → chunk parse error:", parseError.message);
          }
        }
      }
    }

    if (partial.trim()) {
      try {
        const finalChunk = JSON.parse(partial);
        if (finalChunk.response) {
          fullMessage += finalChunk.response;
        }
        event.sender.send("stream-chunk", partial);
      } catch (parseError) {
        console.warn("[IPC] → final chunk parse error:", parseError.message);
      }
    }

    console.log("[IPC] → full response text:", fullMessage);

    addAssistantMessage(fullMessage.trim());

    event.sender.send("stream-end");
  } catch (err) {
    console.error("[IPC] → streaming error:", err);
    event.sender.send("stream-error", "Erro ao obter resposta");
  }
});
