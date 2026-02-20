import type { Metadata } from "next";
import PaletteTool from "./PaletteTool";

export const metadata: Metadata = {
  title: "AI Color Palette Generator | TonaSuite",
  description:
    "Generate beautiful, on-brand color palettes in seconds. Copy hex codes, export CSS variables, and explore palettes by style and industry.",
};

export default function Page() {
  return <PaletteTool />;
}
