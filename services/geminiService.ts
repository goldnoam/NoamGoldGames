import { GoogleGenAI, Type } from "@google/genai";

export const generateGameMetadata = async (title: string, url: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a professional game curator. Generate a professional, exciting description (1-2 sentences) and a list of 3-5 relevant category tags (e.g., Action, Puzzle, Strategy) for a web-based game titled "${title}" located at ${url}. Provide the output in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "A short, engaging description of the game.",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of relevant genre or category tags.",
            },
          },
          required: ["description", "tags"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Metadata Generation failed:", error);
    return null;
  }
};