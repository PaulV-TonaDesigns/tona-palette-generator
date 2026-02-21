"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toPng } from "html-to-image";

type Theme = "light" | "dark";

type PaletteColor = {
  hex: string;
  name: string;
};

type PaletteResponse = {
  palette_name: string;
  description: string;
  colors: PaletteColor[];
  mode?: Theme;
};

type LockedColor = {
  index: number; // 0..4
  hex: string;
  name?: string;
};

type Preset = {
  label: string;
  style: string;
  industry: string;
};

const PRESETS: Preset[] = [
  { label: "Luxury Real Estate", style: "Luxury", industry: "Real Estate" },
  { label: "Modern E-Commerce", style: "Modern minimal", industry: "E-Commerce" },
  { label: "Healthcare Calm", style: "Calm clinical", industry: "Medical / Healthcare" },
  { label: "Law Firm Trust", style: "Professional trust", industry: "Law Firm" },
  { label: "Automotive Performance", style: "Performance bold", industry: "Automotive" },
  { label: "Hospitality Boutique", style: "Boutique warm", industry: "Hospitality" },
  { label: "Creative Studio", style: "Playful editorial", industry: "Creative Design" },
  { label: "Accounting Clean", style: "Clean reliable", industry: "Accounting" },
];

function normalizeHex(hex: string) {
  if (!hex) return "";
  let h = hex.trim().toUpperCase();
  if (!h.startsWith("#")) h = `#${h}`;
  if (!/^#[0-9A-F]{6}$/.test(h)) return "";
  return h;
}

export default function PaletteTool() {
  const [style, setStyle] = useState("");
  const [industry, setIndustry] = useState("");
  const [uiTheme, setUiTheme] = useState<Theme>("light");
  const [paletteMode, setPaletteMode] = useState<Theme>("light");

  const [palette, setPalette] = useState<PaletteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // ✅ Locks stored by index
  const [locked, setLocked] = useState<Record<number, LockedColor>>({});

  const searchParams = useSearchParams();
  const isEmbed = useMemo(() => searchParams.get("embed") === "1", [searchParams]);

  // Only send height updates when embedded
  useEffect(() => {
    if (!isEmbed) return;

    function sendHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "TONA_IFRAME_HEIGHT", height }, "*");
    }

    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, [isEmbed]);

  function isLightHex(hex: string) {
    const h = hex.replace("#", "");
    if (h.length !== 6) return false;

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
  }

  function toTitleCase(input: string) {
    if (!input) return "";
    return input
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 1500);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    showToast(text.startsWith("#") ? `Copied ${text}` : "Copied");
  }

  function getLockedArray(): LockedColor[] {
    return Object.values(locked)
      .sort((a, b) => a.index - b.index)
      .map((c) => ({
        index: c.index,
        hex: normalizeHex(c.hex),
        name: c.name,
      }))
      .filter((c) => c.hex);
  }

  function toggleLock(index: number) {
    if (!palette?.colors?.[index]) return;

    const current = palette.colors[index];
    const hex = normalizeHex(current.hex);
    const name = current.name;

    setLocked((prev) => {
      const next = { ...prev };
      if (next[index]) {
        delete next[index];
      } else {
        next[index] = { index, hex, name };
      }
      return next;
    });
  }

  function clearLocks() {
    setLocked({});
    showToast("Locks cleared");
  }

  async function generatePalette() {
    if (!style.trim() && !industry.trim()) {
      showToast("Enter a style or pick an industry");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style,
          industry,
          mode: paletteMode,
          lockedColors: getLockedArray(), // ✅ send locks
        }),
      });

      const data = (await res.json()) as any;

      if (!res.ok) {
        showToast(data?.error || "Request failed");
        return;
      }

      // ✅ Keep existing locks but refresh hex/name from returned palette
      setPalette(data as PaletteResponse);

      // If you want locks to “snap” to the returned names, update them:
      if (Array.isArray(data?.colors)) {
        setLocked((prev) => {
          const next = { ...prev };
          for (const k of Object.keys(next)) {
            const idx = Number(k);
            const c = data.colors?.[idx];
            if (c?.hex) next[idx] = { index: idx, hex: c.hex, name: c.name };
          }
          return next;
        });
      }
    } catch {
      showToast("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPNG() {
    if (!palette) return;

    const node = document.getElementById("palette-export");
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: uiTheme === "dark" ? "#020617" : "#ffffff",
      });

      const safeName = (palette.palette_name || "palette")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const link = document.createElement("a");
      link.download = `${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      showToast("PNG export failed");
    }
  }

  const cardShell =
    uiTheme === "dark"
      ? "bg-slate-950 text-white border-white/10"
      : "bg-white text-black border-black/10";

  const lockedCount = Object.keys(locked).length;

  return (
    <main
      className={`min-h-screen ${isEmbed ? "p-4" : "p-10"} transition ${
        uiTheme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-white via-orange-50 to-pink-50 text-black"
      }`}
    >
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-xl shadow-lg text-sm backdrop-blur-md border transition z-50
            ${
              uiTheme === "dark"
                ? "bg-white/10 text-white border-white/10"
                : "bg-black/80 text-white border-black/20"
            }`}
        >
          {toast}
        </div>
      )}

      {!isEmbed && <h1 className="text-3xl font-bold mb-6">AI Color Palette Generator</h1>}

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

      {/* ✅ Presets row */}
      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <select
          className={`p-3 rounded-xl w-72 outline-none border transition
            ${uiTheme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-black/10"}`}
          defaultValue=""
          onChange={(e) => {
            const val = e.target.value;
            if (!val) return;
            const preset = PRESETS.find((p) => p.label === val);
            if (!preset) return;

            setStyle(preset.style);
            setIndustry(preset.industry);
            showToast(`Preset: ${preset.label}`);
          }}
        >
          <option value="">Presets (Optional)</option>
          {PRESETS.map((p) => (
            <option key={p.label} value={p.label}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Lock status */}
        <div
          className={`text-sm px-3 py-2 rounded-xl border ${
            uiTheme === "dark" ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
          }`}
        >
          Locks: <span className="font-semibold">{lockedCount}</span>/5
        </div>

        {lockedCount > 0 && (
          <button
            onClick={clearLocks}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition border
              ${
                uiTheme === "dark"
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/10"
                  : "bg-black/5 hover:bg-black/10 text-black border-black/10"
              }`}
          >
            Clear Locks
          </button>
        )}
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
            ${uiTheme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-black/10"}`}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">Select Industry (Optional)</option>
          <option value="Accounting">Accounting</option>
          <option value="Automotive">Automotive</option>
          <option value="Creative Design">Creative Design</option>
          <option value="Marketing Agency">Marketing Agency</option>
          <option value="Medical / Healthcare">Medical / Healthcare</option>
          <option value="Law Firm">Law Firm</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Tech Startup">Tech Startup</option>
          <option value="E-Commerce">E-Commerce</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Other">Other</option>
        </select>

        <select
          className={`p-3 rounded-xl outline-none border transition
            ${uiTheme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-black/10"}`}
          value={paletteMode}
          onChange={(e) => setPaletteMode(e.target.value as Theme)}
        >
          <option value="light">Palette: Light</option>
          <option value="dark">Palette: Dark</option>
        </select>

        <button
          onClick={generatePalette}
          className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition
            bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 active:scale-[0.99]"
        >
          {loading ? "Generating..." : lockedCount ? `Generate (keep ${lockedCount})` : "Generate"}
        </button>
      </div>

      {/* Actions (only when palette exists) */}
      {palette && (
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => copyToClipboard(palette.colors.map((c) => c.hex).join(", "))}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm border
              ${
                uiTheme === "dark"
                  ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                  : "bg-black/10 hover:bg-black/15 text-black border-black/10"
              }`}
          >
            Copy All Colors
          </button>

          <button
            onClick={() => {
              const vars = palette.colors
                .map((c) => `--${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
                .join("\n");
              copyToClipboard(vars);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm border
              ${
                uiTheme === "dark"
                  ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                  : "bg-black/10 hover:bg-black/15 text-black border-black/10"
              }`}
          >
            Copy CSS Variables
          </button>

          <button
            onClick={downloadPNG}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:opacity-95 active:scale-[0.99] transition"
          >
            Download PNG
          </button>
        </div>
      )}

      {/* Export card */}
      {palette && (
        <div id="palette-export" className={`rounded-3xl shadow-xl border transition ${cardShell}`}>
          <div className="p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-2">{toTitleCase(palette.palette_name)}</h2>
              <p className={uiTheme === "dark" ? "text-white/70" : "text-gray-600"}>
                {palette.description}
              </p>
            </div>

            {/* Swatches */}
            <div className="flex gap-4 flex-wrap">
              {palette.colors?.map((color, index) => {
                const light = isLightHex(color.hex);
                const isLocked = Boolean(locked[index]);

                return (
                  <div
                    key={index}
                    className={`relative w-44 h-48 rounded-2xl shadow-lg border overflow-hidden
                      ${uiTheme === "dark" ? "border-white/10" : "border-black/10"}`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {/* click-to-copy area */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(color.hex)}
                      className={`w-full h-full text-left p-4 flex flex-col justify-end transition ${
                        light ? "text-black" : "text-white"
                      }`}
                      title="Click to copy hex"
                    >
                      <span className="font-bold">{color.hex}</span>
                      <span className={`text-sm ${light ? "text-black/80" : "text-white/85"}`}>
                        {toTitleCase(color.name)}
                      </span>
                    </button>

                    {/* Lock button (small, premium, top-right) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(index);
                        showToast(isLocked ? "Unlocked color" : "Locked color");
                      }}
                      className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur
                        ${
                          light
                            ? "bg-white/50 border-black/10 text-black hover:bg-white/70"
                            : "bg-black/30 border-white/15 text-white hover:bg-black/40"
                        }`}
                      title={isLocked ? "Unlock color" : "Lock color"}
                    >
                      {isLocked ? "Locked" : "Lock"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Watermark */}
            <div className="mt-10 flex justify-end">
              <span
                className={uiTheme === "dark" ? "text-white/40" : "text-black/40"}
                style={{ fontFamily: "Outfit", letterSpacing: "0.12em", fontSize: 12 }}
              >
                tonadesigns.com
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}