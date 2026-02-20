import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { style, industry, mode } = body;

    const prompt = `
Generate a web design color palette.

Return ONLY valid JSON in this format:
{
  "palette_name": string,
  "description": string,
  "mode": string,
  "colors": [
    { "name": string, "hex": string }
  ]
}

Requirements:
- Exactly 5 colors
- Valid uppercase hex codes (#RRGGBB)
- Balanced UI palette
- Mode: ${mode}
- Style: ${style}
- Industry context: ${industry || "General web design"}

`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a senior brand designer. Output only valid JSON. No markdown.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    return NextResponse.json(JSON.parse(content || "{}"));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate palette" }, { status: 500 });
  }
}
