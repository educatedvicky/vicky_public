
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedBooking } from "../types";

// Fix: Strictly use process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseUnstructuredMessage(message: string): Promise<ParsedBooking> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following message into an appointment booking for a physiotherapist.
      Message: "${message}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patientName: { type: Type.STRING, description: "Name of the patient" },
            date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
            time: { type: Type.STRING, description: "Time in HH:MM format" },
            reason: { type: Type.STRING, description: "Brief summary of the physical issue or reason for visit" },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 1" }
          },
          required: ["patientName", "date", "time", "reason", "confidence"]
        }
      }
    });

    const parsed = JSON.parse(response.text.trim()) as ParsedBooking;
    return parsed;
  } catch (error) {
    console.error("AI Parsing Error:", error);
    throw new Error("Failed to parse message");
  }
}
