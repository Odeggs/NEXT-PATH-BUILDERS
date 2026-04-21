import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will use mock responses.");
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateAIResponse(prompt: string, systemInstruction?: string) {
  if (!ai) {
    // Mock response if API key is missing
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `[MOCK RESPONSE] This is a simulated response for: "${prompt.substring(0, 50)}..."`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are PathBridge, a helpful learning and career assistant for Nigerian students. Provide clear, encouraging, and localized advice.",
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
}
