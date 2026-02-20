import type { Metadata } from "next";
import { Suspense } from "react";
import PaletteTool from "./PaletteTool";

export const metadata: Metadata = {
  title: "AI Color Palette Generator | TonaSuite",
  description:
    "Generate beautiful, on-brand color palettes instantly. Copy hex codes, export CSS variables, and explore palettes by style and industry.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading…</div>}>
      <PaletteTool />
    </Suspense>
  );
}
