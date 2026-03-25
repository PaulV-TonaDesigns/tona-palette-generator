import type { WireframeRequest } from "./schema";

const PATTERNS: Record<string, string[]> = {
  about: [
    "Split Story/Image + Facts Row",
    "Story Top + Stats Cards + Image",
    "Image Left + Story Right + Facts List",
  ],
  services: [
    "Header + 3-col card grid",
    "Header + Featured card + grid",
    "Header + grid + CTA row",
  ],
  contact: [
    "Form Left / Info Right",
    "Info Left / Form Right + Map below",
    "Header + Info row + Form full-width",
  ],
  hero: [
  "Hero: Headline + subhead + CTA row + image",
  "Hero: Split text left / image right",
  "Hero: Centered stack + buttons + proof row",
],
headerNav: [
  "Header: logo left + nav center + CTA right",
  "Header: logo + nav + secondary row (utility links)",
  "Header: logo + hamburger + CTA (mobile-first)",
],
footer: [
  "Footer: 3 columns + newsletter + legal row",
  "Footer: 4 columns + social + bottom bar",
  "Footer: minimal links + legal + social",
],
testimonials: [
  "Testimonials: 3-card grid",
  "Testimonials: quote carousel + avatars",
  "Testimonials: split quote + stats",
],
caseStudy: [
  "Our Work: filter tabs + card grid",
  "Case Study: featured project + grid",
  "Our Work: masonry grid + tags",
],
featuredContent: [
  "Featured: category tabs + cards",
  "Featured: 2-col featured + list",
  "Featured: grid + newsletter CTA",
],
popup: [
  "Popup: headline + short copy + form",
  "Popup: offer + CTA buttons",
  "Popup: newsletter signup + trust line",
],
};

export function buildWireframePrompt(req: WireframeRequest) {
  const patterns = PATTERNS[req.sectionType] ?? [];

  return `
You are generating STRICT JSON that MUST pass validation.

Return EXACTLY this JSON shape:

{
  "variations": [
    {
      "meta": {
        "sectionType": "${req.sectionType}",
        "layoutName": "string",
        "notes": "string (optional)"
      },
      "grid": {
        "columnsDesktop": 12,
        "gap": "md" | "lg",
        "maxWidth": "xl" | "2xl"
      },
      "elements": [
        {
          "id": "string (unique)",
          "type": "heading" | "paragraph" | "image" | "buttonRow" | "list" | "statsRow" | "cardGrid" | "form" | "contactInfo",
          "spanDesktop": 1-12,
          "order": 0+,
          "label": "string (optional)",
          "props": { ... depends on type ... }
        }
      ]
    },
    { ... }, 
    { ... }
  ]
}

TYPE-SPECIFIC props (MUST match exactly):

heading.props = { "level": "h2" | "h3", "text": "string (optional)" }
paragraph.props = { "lines": 3 | 4 | 5, "text": "string (optional)" }
image.props = { "aspect": "16:9" | "4:3" | "1:1", "corner": "rounded" | "square" }
buttonRow.props = { "buttons": ["primary"] OR ["primary","secondary"] }
list.props = { "items": 2-8, "style": "bullets" | "checks" }
statsRow.props = { "items": 3-5 }
cardGrid.props = {
  "cards": 3-6,
  "columnsDesktop": 2 | 3,
  "cardStyle": "simple" | "withIcon",
  "linesPerCard": 2 | 3,
  "includeCardButton": true | false
}
form.props = { "fields": ["name","email","phone","message" (any subset, min 1)], "includeSubmit": true }
contactInfo.props = { "blocks": ["phone","email","address","hours" (any subset, min 1)], "includeMap": true | false }

HARD RULES:
- Output JSON ONLY. No markdown. No commentary.
- variations MUST be length 3.
- EACH variation MUST include meta + grid + elements.
- elements MUST have at least 3 items.
- All ids must be strings and unique per variation.
- meta.sectionType MUST equal "${req.sectionType}" for ALL 3.
- grid.columnsDesktop MUST be 12 (number).
- cardGrid.props.cards MUST be between 3 and 6.
- cardGrid.props.columnsDesktop MUST be 2 or 3.

Use these pattern families (one per variation):
${patterns.map((p, i) => `${i + 1}) ${p}`).join("\n")}

Context:
industry: ${req.industry}
styleKeywords: ${req.styleKeywords}
mode: ${req.mode}
content: ${JSON.stringify(req.content)}
`.trim();
}