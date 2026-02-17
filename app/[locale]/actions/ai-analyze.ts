'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with the key from your .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeArtisanPiece(imageUrl: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("AI Key is missing. Check your .env.local file.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // This prompt ensures the AI returns clean JSON with all three languages
    const prompt = `
        Analyze this artisan piece. Provide:
        1. Poetic Title (max 5 words)
        2. Soulful story in English (desc_en)
        3. Sophisticated translation in German (desc_de)
        4. Poetic translation in Arabic (desc_ar)
        
        Return ONLY valid JSON:
        {
          "title": "...",
          "desc_en": "...",
          "desc_de": "...",
          "desc_ar": "..."
        }
    `;

    try {
        // Fetch the image from your Supabase URL to send to Gemini
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const text = result.response.text();
        // Clean the response in case Gemini adds markdown backticks
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        throw new Error("AI failed to analyze image.");
    }
}