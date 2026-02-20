"use client";

import { useState } from "react";

export default function PaletteTool() {
  const [style, setStyle] = useState("");
  const [industry, setIndustry] = useState("");
  const [uiTheme, setUiTheme] = useState<"light" | "dark">("light");
  const [paletteMode, setPaletteMode] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function isLightHex(hex: string) {
    const h = hex.replace("#", "");
    if (h.length !== 6) return false;

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
  }

  async function generatePalette() {
    setLoading(true);
    setPalette(null);

    const res = await fetch("/api/palette", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style, industry, mode: paletteMode }),
    });

    const data = await res.json();
    setPalette(data);
    setLoading(false);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <main
      className={`min-h-screen p-10 transition ${
        uiTheme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-white via-orange-50 to-pink-50 text-black"
      }`}
    >
      {copied && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-xl shadow-lg text-sm backdrop-blur-md border transition
          ${
            uiTheme === "dark"
              ? "bg-white/10 text-white border-white/10"
              : "bg-black/80 text-white border-black/20"
          }`}
        >
          Copied {copied}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">
        AI Color Palette Generator
      </h1>

      <div className="flex items-center justify-between mb-6">
        <p className={`${uiTheme === "dark" ? "text-white/70" : "text-gray-600"}`}>
          Generate on-brand color palettes instantly. Click any color to copy.
        </p>

        <button
          onClick={() => {
            const next = uiTheme === "light" ? "dark" : "light";
            setUiTheme(next);
            setPaletteMode(next);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition
          ${
            uiTheme === "dark"
              ? "bg-white/10 text-white hover:bg-white/15"
              : "bg-black/10 text-black hover:bg-black/15"
          }`}
        >
          {uiTheme === "dark" ? "Dark UI ✓" : "Light UI ✓"}
        </button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          placeholder="Style (e.g. Tropical Punch)"
          className={`p-3 rounded-xl w-72 outline-none border transition
          ${
            uiTheme === "dark"
              ? "bg-white/5 border-white/10 placeholder:text-white/40"
              : "bg-white border-black/10 placeholder:text-gray-400"
          }`}
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        />

        <select
          className={`p-3 rounded-xl w-72 outline-none border transition
          ${
            uiTheme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-black/10"
          }`}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">Select Industry (Optional)</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Law Firm">Law Firm</option>
          <option value="Tech Startup">Tech Startup</option>
          <option value="Medical / Healthcare">Medical / Healthcare</option>
          <option value="Marketing Agency">Marketing Agency</option>
          <option value="Other">Other</option>
        </select>

        <select
          className={`p-3 rounded-xl outline-none border transition
          ${
            uiTheme === "dark"
              ? "bg-white/5 border-white/10"
              : "bg-white border-black/10"
          }`}
          value={paletteMode}
          onChange={(e) =>
            setPaletteMode(e.target.value as "light" | "dark")
          }
        >
          <option value="light">Palette: Light</option>
          <option value="dark">Palette: Dark</option>
        </select>

        <button
          onClick={generatePalette}
          className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition
          bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 active:scale-[0.99]"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {palette && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">
            {palette.palette_name}
          </h2>

          <p
            className={`mb-6 ${
              uiTheme === "dark" ? "text-white/70" : "text-gray-600"
            }`}
          >
            {palette.description}
          </p>

          <button
            onClick={() =>
              copyToClipboard(
                palette.colors.map((c: any) => c.hex).join(", ")
              )
            }
            className={`mb-6 px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm
            ${
              uiTheme === "dark"
                ? "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                : "bg-black/10 hover:bg-black/15 text-black border border-black/10"
            }`}
          >
            Copy All Colors
          </button>


      <button
  onClick={() => {
    const vars = palette.colors
      .map((c: any) => `--${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
      .join("\n");
    copyToClipboard(vars);
  }}
 className={`mb-6 ml-3 px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm
  ${uiTheme === "dark"
    ? "bg-white/10 hover:bg-white/15 text-white border border-white/10"
    : "bg-black/10 hover:bg-black/15 text-black border border-black/10"
  }`}

>
  Copy CSS Variables
</button>

          <div className="flex gap-4 flex-wrap">
            {palette.colors?.map((color: any, index: number) => (
              <div
                key={index}
                onClick={() => copyToClipboard(color.hex)}
                className={`cursor-pointer w-32 h-40 rounded-2xl shadow-lg
                border border-white/10 flex flex-col justify-end p-3
                transition transform hover:scale-[1.03]
                ${
                  isLightHex(color.hex)
                    ? "text-black"
                    : "text-white"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                <span className="font-bold">{color.hex}</span>
                <span className="text-sm">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
