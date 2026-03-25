"use client";

import type { WireframeResponse } from "@tonasuite/core";
import WireframeRenderer from "../components/WireframeRenderer";
import { useEffect, useMemo, useState } from "react";


type SectionType =
  | "about"
  | "services"
  | "contact"
  | "hero"
  | "headerNav"
  | "footer"
  | "testimonials"
  | "caseStudy"
  | "featuredContent"
  | "popup";
type Mode = "wireframe" | "annotated";

export default function Home() {
  const [sectionType, setSectionType] = useState<SectionType>("about");
  const [mode, setMode] = useState<Mode>("annotated");
  const [industry, setIndustry] = useState("Law Firm");
  const [styleKeywords, setStyleKeywords] = useState("premium, modern, minimal");
  const [dark, setDark] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
  document.documentElement.classList.toggle("dark", dark);
}, [dark]);

  useEffect(() => {
  const saved = localStorage.getItem("wireframe-dark");
  if (saved) setDark(saved === "1");
}, []);

useEffect(() => {
  localStorage.setItem("wireframe-dark", dark ? "1" : "0");
}, [dark]);

  // About
  const [aboutStory, setAboutStory] = useState(
    "We’ve served our community for over 15 years with a focus on clarity, trust, and results."
  );
  const [aboutFacts, setAboutFacts] = useState(
    "15+ years in practice\nFree consultations\nBilingual staff"
  );
  const [aboutImageIncluded, setAboutImageIncluded] = useState(true);
  const [aboutCtaIncluded, setAboutCtaIncluded] = useState(true);

  // Services
  const [servicesList, setServicesList] = useState(
    "Web Design\nSEO\nWebsite Maintenance\nCustom Programming\nBrand Strategy"
  );
  const [servicesIncludeDescriptions, setServicesIncludeDescriptions] =
    useState(true);
  const [servicesIncludeIcons, setServicesIncludeIcons] = useState(false);
  const [servicesIncludeButtons, setServicesIncludeButtons] = useState(false);

  // Contact
  const [contactIncludeMap, setContactIncludeMap] = useState(true);
  const [contactFormFields, setContactFormFields] = useState({
    name: true,
    email: true,
    phone: true,
    message: true,
  });
  const [contactBlocks, setContactBlocks] = useState({
    phone: true,
    email: true,
    address: true,
    hours: true,
  });

  // Hero
const [heroHeadline, setHeroHeadline] = useState("Grow your business with a modern website");
const [heroSubheadline, setHeroSubheadline] = useState("Fast, clean, and built to convert.");
const [heroIncludePrimaryCta, setHeroIncludePrimaryCta] = useState(true);
const [heroIncludeSecondaryCta, setHeroIncludeSecondaryCta] = useState(false);
const [heroIncludeImage, setHeroIncludeImage] = useState(true);

// Header Nav
const [headerNavItems, setHeaderNavItems] = useState(
  "Services\nOur Work\nAbout\nBlog\nContact"
);
const [headerIncludeCtaButton, setHeaderIncludeCtaButton] = useState(true);
const [headerIncludeAnnouncementBar, setHeaderIncludeAnnouncementBar] = useState(false);

// Footer
const [footerColumns, setFooterColumns] = useState<2 | 3 | 4>(3);
const [footerIncludeNewsletter, setFooterIncludeNewsletter] = useState(true);
const [footerIncludeSocial, setFooterIncludeSocial] = useState(true);
const [footerIncludeLegalLinks, setFooterIncludeLegalLinks] = useState(true);

// Testimonials
const [testimonialsCount, setTestimonialsCount] = useState(3);
const [testimonialsIncludeAvatars, setTestimonialsIncludeAvatars] = useState(true);
const [testimonialsIncludeRatings, setTestimonialsIncludeRatings] = useState(false);

// Case Study / Our Work
const [caseStudyProjects, setCaseStudyProjects] = useState(
  "Radiant Cancer Care\nBridge CFO Accounting\nNC Fun Company"
);
const [caseStudyIncludeFilters, setCaseStudyIncludeFilters] = useState(true);
const [caseStudyIncludeIndustryTags, setCaseStudyIncludeIndustryTags] = useState(true);

// Featured Content
const [featuredItems, setFeaturedItems] = useState(6);
const [featuredContentType, setFeaturedContentType] =
  useState<"blogs" | "resources" | "mixed">("blogs");
const [featuredIncludeCategories, setFeaturedIncludeCategories] = useState(true);

// Popup
const [popupIntent, setPopupIntent] =
  useState<"lead" | "offer" | "newsletter" | "notice">("lead");
const [popupIncludeImage, setPopupIncludeImage] = useState(false);
const [popupFields, setPopupFields] = useState({ name: false, email: true, phone: false });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WireframeResponse | null>(null);
  const [activeVar, setActiveVar] = useState(0);

  const payload = useMemo(() => {
  const base = { sectionType, industry, styleKeywords, mode };

  if (sectionType === "about") {
    return {
      ...base,
      content: {
        story: aboutStory,
        facts: aboutFacts
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        imageIncluded: aboutImageIncluded,
        ctaIncluded: aboutCtaIncluded,
      },
    };
  }

  if (sectionType === "services") {
    return {
      ...base,
      content: {
        services: servicesList
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 6),
        includeDescriptions: servicesIncludeDescriptions,
        includeIcons: servicesIncludeIcons,
        includeCardButtons: servicesIncludeButtons,
      },
    };
  }

  if (sectionType === "contact") {
    return {
      ...base,
      content: {
        includeMap: contactIncludeMap,
        formFields: Object.entries(contactFormFields)
          .filter(([, v]) => v)
          .map(([k]) => k),
        contactBlocks: Object.entries(contactBlocks)
          .filter(([, v]) => v)
          .map(([k]) => k),
      },
    };
  }

  if (sectionType === "hero") {
    return {
      ...base,
      content: {
        headline: heroHeadline,
        subheadline: heroSubheadline,
        includePrimaryCta: heroIncludePrimaryCta,
        includeSecondaryCta: heroIncludeSecondaryCta,
        includeImage: heroIncludeImage,
      },
    };
  }

  if (sectionType === "headerNav") {
    return {
      ...base,
      content: {
        navItems: headerNavItems
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 8),
        includeCtaButton: headerIncludeCtaButton,
        includeAnnouncementBar: headerIncludeAnnouncementBar,
      },
    };
  }

  if (sectionType === "footer") {
    return {
      ...base,
      content: {
        columns: footerColumns,
        includeNewsletter: footerIncludeNewsletter,
        includeSocial: footerIncludeSocial,
        includeLegalLinks: footerIncludeLegalLinks,
      },
    };
  }

  if (sectionType === "testimonials") {
    return {
      ...base,
      content: {
        count: testimonialsCount,
        includeAvatars: testimonialsIncludeAvatars,
        includeRatings: testimonialsIncludeRatings,
      },
    };
  }

  if (sectionType === "caseStudy") {
    return {
      ...base,
      content: {
        projects: caseStudyProjects
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 6),
        includeFilters: caseStudyIncludeFilters,
        includeIndustryTags: caseStudyIncludeIndustryTags,
      },
    };
  }

  if (sectionType === "featuredContent") {
    return {
      ...base,
      content: {
        items: featuredItems,
        contentType: featuredContentType,
        includeCategories: featuredIncludeCategories,
      },
    };
  }

  // popup
  return {
    ...base,
    content: {
      intent: popupIntent,
      includeImage: popupIncludeImage,
      fields: Object.entries(popupFields)
        .filter(([, v]) => v)
        .map(([k]) => k),
    },
  };
}, [
  sectionType,
  industry,
  styleKeywords,
  mode,

  aboutStory,
  aboutFacts,
  aboutImageIncluded,
  aboutCtaIncluded,

  servicesList,
  servicesIncludeDescriptions,
  servicesIncludeIcons,
  servicesIncludeButtons,

  contactIncludeMap,
  contactFormFields,
  contactBlocks,

  heroHeadline,
  heroSubheadline,
  heroIncludePrimaryCta,
  heroIncludeSecondaryCta,
  heroIncludeImage,

  headerNavItems,
  headerIncludeCtaButton,
  headerIncludeAnnouncementBar,

  footerColumns,
  footerIncludeNewsletter,
  footerIncludeSocial,
  footerIncludeLegalLinks,

  testimonialsCount,
  testimonialsIncludeAvatars,
  testimonialsIncludeRatings,

  caseStudyProjects,
  caseStudyIncludeFilters,
  caseStudyIncludeIndustryTags,

  featuredItems,
  featuredContentType,
  featuredIncludeCategories,

  popupIntent,
  popupIncludeImage,
  popupFields,
]);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveVar(0);

    try {
      const res = await fetch("/api/wireframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
  console.error("API error:", data);
  setError(
    data?.details
      ? JSON.stringify(data.details, null, 2)
      : data?.error ?? "Failed to generate wireframe."
  );
  setLoading(false);
  return;
}

      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-6xl p-8">
        <div className="flex items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
      TonaSuite Wireframe Tool
    </h1>
    <p className="mt-2 text-gray-700 dark:text-gray-300">
      Generate 3 layout variations as structured JSON and render them as wireframes.
    </p>
  </div>

  <button
    type="button"
    onClick={() => setDark((v) => !v)}
    className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition hover:-translate-y-[1px] hover:shadow dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
  >
    {dark ? "☼ Light mode" : "☾ Dark mode"}
  </button>
</div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          {/* Controls */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section Type
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-white/20"
                  value={sectionType}
                  onChange={(e) =>
                    setSectionType(e.target.value as SectionType)
                  }
                >
                  <option value="hero">Hero Section</option>
<option value="headerNav">Header Navigation</option>
<option value="about">About</option>
<option value="services">Services</option>
<option value="testimonials">Testimonials</option>
<option value="caseStudy">Case Study / Our Work</option>
<option value="featuredContent">Featured Content</option>
<option value="contact">Contact</option>
<option value="footer">Footer</option>
<option value="popup">Popup</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Industry
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-white/20"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Style Keywords
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-white/20"
                  value={styleKeywords}
                  onChange={(e) => setStyleKeywords(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mode
                </label>
                <div className="flex gap-2">
                  <button
                    className={`rounded-xl px-3 py-2 text-sm ring-1 ${
                      mode === "wireframe"
                        ? "bg-gray-900 text-white ring-gray-900"
                        : "bg-white text-gray-700 ring-gray-200"
                    }`}
                    onClick={() => setMode("wireframe")}
                    type="button"
                  >
                    Wireframe
                  </button>
                  <button
                    className={`rounded-xl px-3 py-2 text-sm ring-1 ${
                      mode === "annotated"
                        ? "bg-gray-900 text-white ring-gray-900"
                        : "bg-white text-gray-700 ring-gray-200"
                    }`}
                    onClick={() => setMode("annotated")}
                    type="button"
                  >
                    Annotated
                  </button>
                </div>
              </div>

              {/* Section-specific inputs */}
              {sectionType === "about" && (
                <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Story
                    </label>
                    <textarea
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                      rows={4}
                      value={aboutStory}
                      onChange={(e) => setAboutStory(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Facts (one per line)
                    </label>
                    <textarea
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                      rows={3}
                      value={aboutFacts}
                      onChange={(e) => setAboutFacts(e.target.value)}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={aboutImageIncluded}
                      onChange={(e) => setAboutImageIncluded(e.target.checked)}
                    />
                    Include Image
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={aboutCtaIncluded}
                      onChange={(e) => setAboutCtaIncluded(e.target.checked)}
                    />
                    Include CTA
                  </label>
                </div>
              )}

              {sectionType === "services" && (
                <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Services (one per line)
                    </label>
                    <textarea
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                      rows={5}
                      value={servicesList}
                      onChange={(e) => setServicesList(e.target.value)}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={servicesIncludeDescriptions}
                      onChange={(e) =>
                        setServicesIncludeDescriptions(e.target.checked)
                      }
                    />
                    Include Description Lines
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={servicesIncludeIcons}
                      onChange={(e) => setServicesIncludeIcons(e.target.checked)}
                    />
                    Include Icon Placeholder
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={servicesIncludeButtons}
                      onChange={(e) =>
                        setServicesIncludeButtons(e.target.checked)
                      }
                    />
                    Include Card Buttons
                  </label>
                </div>
              )}

              {sectionType === "contact" && (
                <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={contactIncludeMap}
                      onChange={(e) => setContactIncludeMap(e.target.checked)}
                    />
                    Include Map Placeholder
                  </label>

                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Form Fields
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                      {Object.keys(contactFormFields).map((k) => (
                        <label key={k} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(contactFormFields as any)[k]}
                            onChange={(e) =>
                              setContactFormFields((prev) => ({
                                ...prev,
                                [k]: e.target.checked,
                              }))
                            }
                          />
                          {k}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Contact Blocks
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                      {Object.keys(contactBlocks).map((k) => (
                        <label key={k} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(contactBlocks as any)[k]}
                            onChange={(e) =>
                              setContactBlocks((prev) => ({
                                ...prev,
                                [k]: e.target.checked,
                              }))
                            }
                          />
                          {k}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onGenerate}
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate 3 Variations"}
              </button>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
            {!result ? (
              <div className="text-sm text-gray-600">
                Generate a section to see wireframe variations here.
              </div>
            ) : (
              <div
  className={`space-y-4 transition-opacity duration-150 ${
    isTransitioning ? "opacity-40" : "opacity-100"
  }`}
>
                <div className="flex flex-wrap gap-2">
                  {result.variations.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
  if (i === activeVar) return;
  setIsTransitioning(true);
  setTimeout(() => {
    setActiveVar(i);
    setIsTransitioning(false);
  }, 160);
}}
                      className={`rounded-xl px-3 py-2 text-sm ring-1 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm ${
  activeVar === i
    ? "bg-gray-900 text-white ring-gray-900 dark:bg-white dark:text-gray-900 dark:ring-white"
    : "bg-white text-gray-800 ring-gray-300 hover:ring-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700 dark:hover:ring-gray-500"
}`}
                    >
                      Variation {i + 1}
                    </button>
                  ))}
                </div>

                <pre className="max-h-[240px] overflow-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-700 ring-1 ring-gray-100 dark:bg-gray-950 dark:text-gray-300 dark:ring-gray-800">
{JSON.stringify(result.variations[activeVar], null, 2)}
                </pre>

                <div className="rounded-xl border border-gray-200 p-4">
  <WireframeRenderer
  blueprint={result.variations[activeVar]}
  showLabels={mode === "annotated"}
/>
</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}