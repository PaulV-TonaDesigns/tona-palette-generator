import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  WireframeRequestSchema,
  validateWireframeResponse,
  buildWireframePrompt,
} from "@tonasuite/core";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = WireframeRequestSchema.parse(json);

    const prompt = buildWireframePrompt(parsed);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator. Output must be valid JSON only. No markdown, no commentary.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty response from model." },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Model returned non-JSON output.", raw: content },
        { status: 502 }
      );
    }

    let validated: any;

try {
  validated = validateWireframeResponse(data);
} catch (e: any) {
  const repair = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You fix JSON to match the provided validation rules. Output ONLY valid JSON.",
      },
      {
        role: "user",
        content: `The JSON below failed validation. Fix it so it matches the schema rules EXACTLY.

Validation errors:
${JSON.stringify(e?.issues ?? e?.message ?? e, null, 2)}

Bad JSON:
${JSON.stringify(data, null, 2)}

Return fixed JSON only.`,
      },
    ],
  });

  const repairedContent = repair.choices?.[0]?.message?.content;
  if (!repairedContent) {
    return NextResponse.json(
      { error: "Repair failed (empty)." },
      { status: 502 }
    );
  }

  const repaired = JSON.parse(repairedContent);
  validated = validateWireframeResponse(repaired);
}

return NextResponse.json(validated, { status: 200 });
  } catch (err: any) {
    // Zod validation errors
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request payload", details: err.issues },
        { status: 400 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Server error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}