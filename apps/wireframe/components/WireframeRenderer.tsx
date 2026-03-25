// apps/wireframe/components/WireframeRenderer.tsx
"use client";

import type { SectionBlueprint, ElementSchema } from "@tonasuite/core";
import type { z } from "zod";

type Element = z.infer<typeof ElementSchema>;

// Tailwind-safe mapping (so classes exist at build time)
const COL_SPAN: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

function renderElement(el: Element) {
  switch (el.type) {
  case "heading": {
    const text = el.props.text ?? el.label ?? "Heading";
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-6 w-3/4 rounded bg-gray-300" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            heading · {el.props.level}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-gray-500">{text}</div>
      </div>
    );
  }

  case "paragraph": {
    const text = el.props.text ?? el.label ?? "Paragraph";
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            paragraph · {el.props.lines} lines
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {Array.from({ length: el.props.lines }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-gray-200" />
          ))}
        </div>
        <div className="mt-2 text-[11px] text-gray-500">{text}</div>
      </div>
    );
  }

  case "image": {
    const aspectClass =
      el.props.aspect === "16:9"
        ? "aspect-video"
        : el.props.aspect === "4:3"
        ? "aspect-[4/3]"
        : "aspect-square";

    const cornerClass =
      el.props.corner === "rounded" ? "rounded-2xl" : "rounded-none";

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            image · {el.props.aspect} · {el.props.corner}
          </span>
        </div>
        <div className={`w-full bg-gray-200 ${aspectClass} ${cornerClass}`} />
        {el.label && <div className="mt-2 text-[11px] text-gray-500">{el.label}</div>}
      </div>
    );
  }

  case "buttonRow": {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            buttons · {el.props.buttons.join(" + ")}
          </span>
        </div>
        <div className="flex gap-2">
          {el.props.buttons.map((b, i) => (
            <div
              key={i}
              className={`h-10 rounded-xl ${
                b === "primary" ? "w-32 bg-gray-300" : "w-28 bg-gray-200"
              }`}
            />
          ))}
        </div>
        {el.label && <div className="mt-2 text-[11px] text-gray-500">{el.label}</div>}
      </div>
    );
  }

  case "list": {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            list · {el.props.items} · {el.props.style}
          </span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: el.props.items }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-300" />
              <div className="h-3 w-3/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
        {el.label && <div className="mt-2 text-[11px] text-gray-500">{el.label}</div>}
      </div>
    );
  }

  case "statsRow": {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            stats · {el.props.items}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: el.props.items }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="h-5 w-1/2 rounded bg-gray-300" />
              <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
        {el.label && <div className="mt-2 text-[11px] text-gray-500">{el.label}</div>}
      </div>
    );
  }

  case "cardGrid": {
    const cols =
      el.props.columnsDesktop === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2";

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            cards · {el.props.cards} · cols {el.props.columnsDesktop} · {el.props.cardStyle}
          </span>
        </div>
        <div className={`grid gap-4 ${cols}`}>
          {Array.from({ length: el.props.cards }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-start gap-3">
                {el.props.cardStyle === "withIcon" && (
                  <div className="h-10 w-10 rounded-xl bg-gray-200" />
                )}
                <div className="flex-1">
                  <div className="h-5 w-2/3 rounded bg-gray-300" />
                  <div className="mt-3 space-y-2">
                    {Array.from({ length: el.props.linesPerCard }).map((__, j) => (
                      <div key={j} className="h-3 w-full rounded bg-gray-200" />
                    ))}
                  </div>
                  {el.props.includeCardButton && (
                    <div className="mt-4 h-9 w-28 rounded-xl bg-gray-300" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {el.label && <div className="mt-2 text-[11px] text-gray-500">{el.label}</div>}
      </div>
    );
  }

  case "form": {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            form · {el.props.fields.join(", ")}
          </span>
        </div>
        <div className="space-y-3">
          {el.props.fields.map((f, i) => (
            <div
              key={i}
              className="h-10 w-full rounded-xl bg-gray-100 ring-1 ring-gray-200"
              title={f}
            />
          ))}
          {el.props.includeSubmit && (
            <div className="h-11 w-40 rounded-xl bg-gray-300" />
          )}
        </div>
        {el.label && <div className="mt-2 text-[11px] text-gray-500">{el.label}</div>}
      </div>
    );
  }

  case "contactInfo": {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
            contact · {el.props.blocks.join(", ")} {el.props.includeMap ? "+ map" : ""}
          </span>
        </div>
        <div className="space-y-3">
          {el.props.blocks.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
        {el.props.includeMap && (
          <div className="mt-4 aspect-video w-full rounded-2xl bg-gray-100 ring-1 ring-gray-200" />
        )}
        {el.label && <div className="mt-2 text-[11px] text-gray-500">{el.label}</div>}
      </div>
    );
  }

  default:
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-600">
        Unknown: {el.type}
      </div>
    );
}  
}

export default function WireframeRenderer({
  blueprint,
  showLabels = false,
}: {
  blueprint: SectionBlueprint;
  showLabels?: boolean;
}) {
  const elements = [...blueprint.elements].sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-12 gap-6">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`col-span-12 ${COL_SPAN[el.spanDesktop] ?? "lg:col-span-12"}`}
        >
          {/* Subtle label row (only in annotated mode) */}
          {showLabels && (
            <div className="mb-2 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                <span className="font-medium">{el.label ?? el.type}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{el.type}</span>
              </div>

              <div className="text-[11px] text-gray-400">
                span {el.spanDesktop} • order {el.order}
              </div>
            </div>
          )}

          {renderElement(el)}
        </div>
      ))}
    </div>
  );

}