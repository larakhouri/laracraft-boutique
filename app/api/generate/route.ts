import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        // Safety check
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) return NextResponse.json({ error: "No image found" }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        // FIX: Use 'gemini-1.5-flash-latest' to ensure availability
        // If this still fails, try 'gemini-1.5-pro'
        // Updated to use getGenerativeModel with the new model name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `
      You are the expert curator for 'LaraCraft'.
      Analyze this image and return a raw JSON object with:
      - title: English title.
      - price: Number (Euro).
      - category: One of ['atelier', 'supplies', 'gallery', 'printing'].
      - description: English description (1 sentence).
      - description_ar: Arabic description (Professional & Warm).
      - tags: Array of 5 strings.
      
      Output ONLY raw JSON. Do not use Markdown blocks.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean & Parse
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanText));

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: error.message || "Unknown Error" }, { status: 500 });
    }
}
