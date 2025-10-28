import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI endpoint will fail without it.");
}

const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // By default we do NOT return the full generated text to the client.
    // This endpoint accepts an optional `expose: true` flag in the body to
    // explicitly request the raw text (useful for debugging). Otherwise we
    // return a short acknowledgement so sensitive/generated content isn't
    // leaked to clients unintentionally.
    const { prompt, expose } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const systemInstruction =
      "You are a helpful recipe assistant. Given user input about ingredients, dietary preferences, or dish names, generate a clear, step-by-step recipe including ingredients, instructions, cooking time, and servings. Keep answers concise but complete.";

    const contents = `${systemInstruction}\n\nUser: ${prompt}`;

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    const text =
      (response as any).text ??
      (response as any)?.output?.[0]?.content?.[0]?.text ??
      null;

    if (!text) {
      return NextResponse.json(
        { error: "No text returned from AI" },
        { status: 500 }
      );
    }

    // If the caller explicitly asked to expose the raw AI text, return it.
    // Otherwise, return a short acknowledgement only.
    if (expose === true) {
      return NextResponse.json({ text });
    }

    return NextResponse.json({ message: "generated" });
  } catch (err: any) {
    console.error("/api/ai/generate error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
