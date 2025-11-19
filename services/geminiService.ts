import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing in environment variables. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateGameMetadata = async (title: string, url: string): Promise<{ description: string; tags: string[] } | null> => {
  const ai = getClient();
  if (!ai) return null;

  try {
    const prompt = `
      I have a web-based game titled "${title}" located at "${url}".
      Please generate a short, engaging description (max 25 words) for a gallery card.
      Also, suggest 3-4 relevant genre tags.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["description", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as { description: string; tags: string[] };
  } catch (error) {
    console.error("Error generating game metadata:", error);
    return null;
  }
};