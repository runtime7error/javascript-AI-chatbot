/**
 * Envia prompt para o Ollama rodando localmente e retorna o texto gerado.
 * @param {{ prompt: string, max_tokens?: number }} options
 * @returns {Promise<string>}
 */
async function generateResponse({ prompt, max_tokens = 100 }) {
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gemma3:1b-it-qat', prompt, max_tokens, stream: false }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API retornou status ${res.status}`);
    }

    const json = await res.json();

    if (!json.response) {
      throw new Error('Resposta inválida da API Ollama');
    }

    return json.response.trim();
  } catch (error) {
    console.error('Erro em ollamaService.generateResponse:', error);
    throw new Error('Não foi possível obter resposta da IA. Verifique se o Ollama está rodando.');
  }
}

module.exports = { generateResponse };