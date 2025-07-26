const messagesDiv = document.getElementById("messages");
const typingIndicator = document.getElementById("typing-indicator");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const toggleThemeBtn = document.getElementById("toggle-theme");

let botParagraph = null;
let accumulated = "";

fetch("../config.json")
  .then((res) => res.json())
  .then((config) => {
    window.config = {
      botName: config.botName || "Bot",
      botPrompt: "Você precisa interpretar um papel fictício: " + (config.botPrompt || "")
    };
  });

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleThemeBtn.textContent = "☀️";
  }
});

toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  toggleThemeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function showTyping() {
  typingIndicator.style.display = "flex";
}
function hideTyping() {
  typingIndicator.style.display = "none";
}

function addBotPlaceholder() {
  botParagraph = document.createElement("p");
  botParagraph.classList.add("bot-message");
  botParagraph.innerHTML = `<strong>${window.config.botName}:</strong> `;
  messagesDiv.appendChild(botParagraph);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  const userP = document.createElement("p");
  userP.innerHTML = `<strong>Você:</strong> ${text}`;
  messagesDiv.appendChild(userP);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  userInput.value = "";

  addBotPlaceholder();
  accumulated = "";
  showTyping();

  window.api.sendMessageStream(text);
}

window.api.onStreamChunk((chunk) => {
  chunk.split("\n").forEach((line) => {
    line = line.trim();
    if (!line) return;

    try {
      const obj = JSON.parse(line);
      if (obj.response != null) {
        accumulated += obj.response;
        console.log("Recebido:", obj.response);
        botParagraph.innerHTML = `<strong>${window.config.botName}</strong> ${accumulated}`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    } catch {}
  });
});
window.api.onStreamEnd(() => {
  hideTyping();
  botParagraph = null;
});
window.api.onStreamError((err) => {
  hideTyping();
  if (botParagraph) {
    botParagraph.innerHTML = `<strong>${window.config.botName}:</strong> ${err}`;
    botParagraph = null;
  }
});
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
