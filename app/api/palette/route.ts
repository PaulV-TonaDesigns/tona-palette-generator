import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type LockedColor = {
  index: number;
  hex: string;
  name?: string;
};

function normalizeHex(hex: string) {
  if (!hex) return "";
  let h = hex.trim().toUpperCase();
  if (!h.startsWith("#")) h = `#${h}`;
  // If something like #FFF accidentally comes through, reject it
  if (!/^#[0-9A-F]{6}$/.test(h)) return "";
  return h;
}

function safeTitle(input: unknown) {
  if (typeof input !== "string") return "";
  return input.trim();
}

function coerceLockedColors(raw: any): LockedColor[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const index = Number(item?.index);
      const hex = normalizeHex(String(item?.hex || ""));
      const name = typeof item?.name === "string" ? item.name : undefined;

      if (!Number.isFinite(index)) return null;
      if (index < 0 || index > 4) return null;
      if (!hex) return null;

      return { index, hex, name };
    })
    .filter(Boolean) as LockedColor[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const style = safeTitle(body?.style);
    const industry = safeTitle(body?.industry);
    const modeRaw = safeTitle(body?.mode);
    const mode = modeRaw === "dark" ? "dark" : "light";

    // ✅ allow industry-only OR style-only, but not empty
    if (!style && !industry) {
      return NextResponse.json(
        { error: "Please enter a style prompt or select an industry." },
        { status: 400 }
      );
    }

    const lockedColors = coerceLockedColors(body?.lockedColors);

    const lockedNote =
      lockedColors.length > 0
        ? `
Locked colors (MUST keep these exact HEX values in the exact positions):
${lockedColors
  .map((c) => `- index ${c.index}: ${c.hex}${c.name ? ` (${c.name})` : ""}`)
  .join("\n")}
`
        : "";

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
- Balanced UI palette (primary/accent/neutral/background-ish mix)
- Mode: ${mode}
- Style: ${style || "(none)"}
- Industry context: ${industry || "General web design"}
${lockedNote}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a senior brand designer. Output only valid JSON. No markdown. No extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      // ✅ Helps guarantee JSON-only output
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content || "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON. Try again." },
        { status: 500 }
      );
    }

    // Basic shape safety
    const palette_name = safeTitle(parsed?.palette_name) || "Generated Palette";
    const description = safeTitle(parsed?.description) || "";
    const colorsRaw = Array.isArray(parsed?.colors) ? parsed.colors : [];

    // Normalize + force exactly 5 colors
    let colors = colorsRaw
      .slice(0, 5)
      .map((c: any, i: number) => {
        const name = safeTitle(c?.name) || `Color ${i + 1}`;
        const hex = normalizeHex(String(c?.hex || ""));
        return { name, hex };
      });

    // If fewer than 5 came back, pad with safe neutral fallbacks
    while (colors.length < 5) {
      colors.push({
        name: `Color ${colors.length + 1}`,
        hex: "#F5F5F5",
      });
    }

    // If any hex invalid, replace with safe fallback
    colors = colors.map((c, i) => ({
      name: c.name || `Color ${i + 1}`,
      hex: c.hex || "#F5F5F5",
    }));

    // ✅ Apply locked colors after generation (guaranteed)
    for (const lock of lockedColors) {
      colors[lock.index] = {
        name: lock.name || colors[lock.index]?.name || `Color ${lock.index + 1}`,
        hex: lock.hex,
      };
    }

    return NextResponse.json({
      palette_name,
      description,
      mode,
      colors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate palette" },
      { status: 500 }
    );
  }
}