import { z } from "zod";

export const SectionTypeSchema = z.enum([
  "about",
  "services",
  "contact",
  "hero",
  "headerNav",
  "footer",
  "testimonials",
  "caseStudy",
  "featuredContent",
  "popup",
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

export const ModeSchema = z.enum(["wireframe", "annotated"]);
export type Mode = z.infer<typeof ModeSchema>;

// ---- Content contracts (inputs) ----
export const AboutContentSchema = z.object({
  story: z.string().min(1),
  facts: z.array(z.string().min(1)).max(6).default([]),
  imageIncluded: z.boolean().default(true),
  ctaIncluded: z.boolean().default(true),
});

export const ServicesContentSchema = z.object({
  services: z.array(z.string().min(1)).min(3).max(6),
  includeDescriptions: z.boolean().default(true),
  includeIcons: z.boolean().default(false),
  includeCardButtons: z.boolean().default(false),
});

export const ContactContentSchema = z.object({
  includeMap: z.boolean().default(false),
  formFields: z.array(z.enum(["name", "email", "phone", "message"])).min(1),
  contactBlocks: z.array(z.enum(["phone", "email", "address", "hours"])).min(1),
});

export const HeroContentSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().min(1).optional(),
  includePrimaryCta: z.boolean().default(true),
  includeSecondaryCta: z.boolean().default(false),
  includeImage: z.boolean().default(true),
});

export const HeaderNavContentSchema = z.object({
  navItems: z.array(z.string().min(1)).min(3).max(8),
  includeCtaButton: z.boolean().default(true),
  includeAnnouncementBar: z.boolean().default(false),
});

export const FooterContentSchema = z.object({
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  includeNewsletter: z.boolean().default(true),
  includeSocial: z.boolean().default(true),
  includeLegalLinks: z.boolean().default(true),
});

export const TestimonialsContentSchema = z.object({
  count: z.number().int().min(2).max(6).default(3),
  includeAvatars: z.boolean().default(true),
  includeRatings: z.boolean().default(false),
});

export const CaseStudyContentSchema = z.object({
  projects: z.array(z.string().min(1)).min(2).max(6),
  includeFilters: z.boolean().default(true),
  includeIndustryTags: z.boolean().default(true),
});

export const FeaturedContentSchema = z.object({
  items: z.number().int().min(3).max(9).default(6),
  contentType: z.enum(["blogs", "resources", "mixed"]).default("blogs"),
  includeCategories: z.boolean().default(true),
});

export const PopupContentSchema = z.object({
  intent: z.enum(["lead", "offer", "newsletter", "notice"]).default("lead"),
  includeImage: z.boolean().default(false),
  fields: z.array(z.enum(["name", "email", "phone"])).min(1).default(["email"]),
});

export const WireframeRequestSchema = z.object({
  sectionType: SectionTypeSchema,
  industry: z.string().min(1),
  styleKeywords: z.string().min(1),
  mode: ModeSchema,
  content: z.union([
  AboutContentSchema,
  ServicesContentSchema,
  ContactContentSchema,
  HeroContentSchema,
  HeaderNavContentSchema,
  FooterContentSchema,
  TestimonialsContentSchema,
  CaseStudyContentSchema,
  FeaturedContentSchema,
  PopupContentSchema,
]),
});
export type WireframeRequest = z.infer<typeof WireframeRequestSchema>;

// ---- Blueprint schema (outputs) ----
const BaseEl = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  spanDesktop: z.number().int().min(1).max(12),
  order: z.number().int().min(0),
  label: z.string().optional(),
});

export const ElementSchema = z.discriminatedUnion("type", [
  BaseEl.extend({
    type: z.literal("heading"),
    props: z.object({ level: z.enum(["h2", "h3"]), text: z.string().optional() }),
  }),
  BaseEl.extend({
    type: z.literal("paragraph"),
    props: z.object({ lines: z.union([z.literal(3), z.literal(4), z.literal(5)]), text: z.string().optional() }),
  }),
  BaseEl.extend({
    type: z.literal("image"),
    props: z.object({ aspect: z.enum(["16:9", "4:3", "1:1"]), corner: z.enum(["rounded", "square"]) }),
  }),
  BaseEl.extend({
    type: z.literal("buttonRow"),
    props: z.object({ buttons: z.array(z.enum(["primary", "secondary"])).min(1).max(2) }),
  }),
  BaseEl.extend({
    type: z.literal("list"),
    props: z.object({ items: z.number().int().min(2).max(8), style: z.enum(["bullets", "checks"]) }),
  }),
  BaseEl.extend({
    type: z.literal("statsRow"),
    props: z.object({ items: z.number().int().min(3).max(5) }),
  }),
  BaseEl.extend({
    type: z.literal("cardGrid"),
    props: z.object({
      cards: z.number().int().min(3).max(6),
      columnsDesktop: z.union([z.literal(2), z.literal(3)]),
      cardStyle: z.enum(["simple", "withIcon"]),
      linesPerCard: z.union([z.literal(2), z.literal(3)]),
      includeCardButton: z.boolean(),
    }),
  }),
  BaseEl.extend({
    type: z.literal("form"),
    props: z.object({
      fields: z.array(z.enum(["name", "email", "phone", "message"])).min(1),
      includeSubmit: z.boolean(),
    }),
  }),
  BaseEl.extend({
    type: z.literal("contactInfo"),
    props: z.object({
      blocks: z.array(z.enum(["phone", "email", "address", "hours"])).min(1),
      includeMap: z.boolean(),
    }),
  }),
]);

export const SectionBlueprintSchema = z.object({
  meta: z.object({
    sectionType: SectionTypeSchema,
    layoutName: z.string().min(1),
    notes: z.string().optional(),
  }),
  grid: z.object({
    columnsDesktop: z.literal(12),
    gap: z.enum(["md", "lg"]),
    maxWidth: z.enum(["xl", "2xl"]),
  }),
  elements: z.array(ElementSchema).min(3),
});

export const WireframeResponseSchema = z.object({
  variations: z.array(SectionBlueprintSchema).length(3),
});

export type SectionBlueprint = z.infer<typeof SectionBlueprintSchema>;
export type WireframeResponse = z.infer<typeof WireframeResponseSchema>;
