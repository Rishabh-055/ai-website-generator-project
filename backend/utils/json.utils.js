/**
 * Safely extracts and parses JSON content from a text block
 * that may contain markdown code wrappers (e.g. ```json ... ```)
 * @param {string} text - Raw output string containing JSON.
 * @returns {object|null} Parsed JSON object, or null if parsing fails.
 */
export const extractJson = (text) => {
  try {
    if (!text || typeof text !== "string") return null;

    // Clean code block ticks
    const cleanedText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const startIndex = cleanedText.indexOf("{");
    const endIndex = cleanedText.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) return null;

    let jsonSnippet = cleanedText.slice(startIndex, endIndex + 1);

    // Sanitize trailing commas before closing braces/brackets
    jsonSnippet = jsonSnippet
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");

    return JSON.parse(jsonSnippet);
  } catch (error) {
    console.error("Failed to parse extracted JSON snippet:", error.message);
    return null;
  }
};

export default extractJson;
