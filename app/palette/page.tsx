import { Suspense } from "react";
import PaletteTool from "./PaletteTool";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <PaletteTool />
    </Suspense>
  );
}