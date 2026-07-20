const GROQ_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Generates an AI response from Groq using llama-3.3-70b-versatile.
 * @param {string} prompt - The prompt to submit to the model.
 * @param {object} options - Optional configuration settings (maxTokens, temperature, systemPrompt).
 * @returns {Promise<string>} The generated content string.
 */
export const generateResponse = async (prompt, options = {}) => {
  const { maxTokens = 4000, temperature = 0.3, systemPrompt = "You are an assistant that must output valid JSON only." } = options;

  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is missing. Please set GROQ_API_KEY in backend/.env");
    }

    const response = await fetch(GROQ_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result?.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("AI service error in generateResponse:", error);
    throw error;
  }
};
