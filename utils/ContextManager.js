const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");
let rawConfig = {};
try {
  rawConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
} catch (err) {
  console.warn("⚠️ Não foi possível carregar config.json:", err);
}

const botName = rawConfig.botName || "Bot";
const botPrompt = rawConfig.botPrompt || "";

const MAX_HISTORY_LENGTH = 8;

let history = [{ role: "system", content: botPrompt }];
/**
 * Adiciona a mensagem do usuário ao histórico
 * @param {string} message
 */
function addUserMessage(message) {
  if (!message || message.trim().length === 0) {
    console.warn(
      "[ContextManager] → tentativa de adicionar mensagem vazia do usuário"
    );
    return;
  }

  history.push({ role: "user", content: message.trim() });
  trimHistory();
  console.log(
    "[ContextManager] → mensagem do usuário adicionada. Total de entradas:",
    history.length
  );
}

/**
 * Adiciona a resposta da IA ao histórico
 * @param {string} message
 */
function addAssistantMessage(message) {
  if (!message || message.trim().length === 0) {
    console.warn(
      "[ContextManager] → tentativa de adicionar resposta vazia da IA"
    );
    return;
  }

  history.push({ role: "assistant", content: message.trim() });
  trimHistory();
  console.log(
    "[ContextManager] → resposta da IA adicionada. Total de entradas:",
    history.length
  );
}

/**
 * Limita o tamanho do histórico para evitar estourar o contexto de tokens
 */
function trimHistory() {
  if (history.length <= MAX_HISTORY_LENGTH * 2 + 1) {
    return;
  }

  const system = history[0];
  const recent = history.slice(-(MAX_HISTORY_LENGTH * 2));

  const removedCount = history.length - recent.length - 1;
  history = [system, ...recent];

  console.log(
    `[ContextManager] → histórico reduzido. Removidas ${removedCount} entradas antigas`
  );
}

/**
 * Monta o prompt completo para enviar ao modelo
 * @returns {string}
 */
function buildPrompt() {
  const prompt =
    history
      .map((turn) => {
        switch (turn.role) {
          case "system":
            return turn.content;
          case "user":
            return `Usuário: ${turn.content}`;
          case "assistant":
            return `${botName}: ${turn.content}`;
          default:
            console.warn("[ContextManager] → role desconhecido:", turn.role);
            return "";
        }
      })
      .join("\n") + `\n${botPrompt}:`;

  return prompt;
}

/**
 * Retorna o histórico atual (para debug)
 * @returns {Array}
 */
function getHistory() {
  return [...history];
}

/**
 * Limpa todo o histórico exceto o system prompt
 */
function clearHistory() {
  history = [history[0]];
  console.log("[ContextManager] → histórico limpo");
}

module.exports = {
  addUserMessage,
  addAssistantMessage,
  buildPrompt,
  getHistory,
  clearHistory,
};
