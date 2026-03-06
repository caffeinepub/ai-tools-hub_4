import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe,
  MessageSquare,
  Mic2,
  PenLine,
  Search,
  Sparkles,
  Star,
  Video,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AITool } from "./backend.d";
import { useGetAllTools, useGetFeaturedTools } from "./hooks/useQueries";

/* ─── Static fallback data (shown while backend loads or if empty) ─── */
const STATIC_TOOLS: AITool[] = [
  {
    id: 1n,
    name: "ChatGPT",
    description:
      "The world's most popular AI chatbot by OpenAI. Write, code, analyze, and brainstorm with GPT-4's powerful language model.",
    category: "Chat",
    url: "https://chatgpt.com",
    isFeatured: true,
  },
  {
    id: 2n,
    name: "Google Gemini",
    description:
      "Google's multimodal AI that understands text, images, and code. Integrated across Google Workspace for seamless productivity.",
    category: "Chat",
    url: "https://gemini.google.com",
    isFeatured: true,
  },
  {
    id: 3n,
    name: "Perplexity AI",
    description:
      "AI-powered search engine that answers questions with real-time web citations. Perfect for research and fact-checking.",
    category: "Research",
    url: "https://perplexity.ai",
    isFeatured: true,
  },
  {
    id: 4n,
    name: "Microsoft Copilot",
    description:
      "Microsoft's AI assistant powered by GPT-4 and DALL-E, built into Windows and Office 365 for daily productivity tasks.",
    category: "Writing",
    url: "https://copilot.microsoft.com",
    isFeatured: true,
  },
  {
    id: 5n,
    name: "Claude",
    description:
      "Anthropic's thoughtful AI assistant known for nuanced writing, analysis, and long-context understanding up to 200K tokens.",
    category: "Chat",
    url: "https://claude.ai",
    isFeatured: true,
  },
  {
    id: 6n,
    name: "Midjourney",
    description:
      "Industry-leading AI image generator producing stunning artistic visuals. Create photorealistic art via Discord prompts.",
    category: "Image",
    url: "https://midjourney.com",
    isFeatured: true,
  },
  {
    id: 7n,
    name: "DALL-E 3",
    description:
      "OpenAI's image generation model with precise prompt adherence. Create detailed illustrations, art, and photos from text.",
    category: "Image",
    url: "https://openai.com/dall-e-3",
    isFeatured: false,
  },
  {
    id: 8n,
    name: "Stable Diffusion",
    description:
      "Open-source AI image generator you can run locally or online. Full creative control with thousands of custom models.",
    category: "Image",
    url: "https://stability.ai",
    isFeatured: false,
  },
  {
    id: 9n,
    name: "GitHub Copilot",
    description:
      "AI pair programmer that autocompletes code in real-time, suggests functions, and explains code directly in your editor.",
    category: "Code",
    url: "https://github.com/features/copilot",
    isFeatured: false,
  },
  {
    id: 10n,
    name: "Codeium",
    description:
      "Free AI coding assistant with autocomplete, chat, and search. Supports 70+ languages and integrates with all major IDEs.",
    category: "Code",
    url: "https://codeium.com",
    isFeatured: false,
  },
  {
    id: 11n,
    name: "Cursor",
    description:
      "AI-first code editor built on VSCode. Chat with your codebase, generate entire features, and debug with natural language.",
    category: "Code",
    url: "https://cursor.sh",
    isFeatured: false,
  },
  {
    id: 12n,
    name: "Runway ML",
    description:
      "Professional AI video editing and generation platform. Create AI videos, remove backgrounds, and generate cinematic scenes.",
    category: "Video",
    url: "https://runwayml.com",
    isFeatured: false,
  },
  {
    id: 13n,
    name: "Pika Labs",
    description:
      "Transform images and text into stunning animated videos with AI. Easy-to-use interface for professional video creation.",
    category: "Video",
    url: "https://pika.art",
    isFeatured: false,
  },
  {
    id: 14n,
    name: "Suno AI",
    description:
      "Generate full songs with vocals and instrumentals from a text prompt. Create complete music tracks in any genre in seconds.",
    category: "Audio",
    url: "https://suno.ai",
    isFeatured: false,
  },
  {
    id: 15n,
    name: "ElevenLabs",
    description:
      "Ultra-realistic AI voice cloning and text-to-speech. Create custom voices, audiobooks, and multilingual voice overs.",
    category: "Audio",
    url: "https://elevenlabs.io",
    isFeatured: false,
  },
  {
    id: 16n,
    name: "Grammarly",
    description:
      "AI writing assistant that checks grammar, tone, clarity, and style. Works across browsers, docs, and email clients.",
    category: "Writing",
    url: "https://grammarly.com",
    isFeatured: false,
  },
  {
    id: 17n,
    name: "Jasper AI",
    description:
      "AI content platform for marketing teams. Generate blog posts, ads, social media content, and brand-consistent copy at scale.",
    category: "Writing",
    url: "https://jasper.ai",
    isFeatured: false,
  },
  {
    id: 18n,
    name: "Notion AI",
    description:
      "Integrated AI in Notion that summarizes, writes, translates, and helps organize your notes and databases.",
    category: "Writing",
    url: "https://notion.so",
    isFeatured: false,
  },
  {
    id: 19n,
    name: "Elicit",
    description:
      "AI research tool that finds and summarizes academic papers. Ask research questions and get structured evidence summaries.",
    category: "Research",
    url: "https://elicit.com",
    isFeatured: false,
  },
  {
    id: 20n,
    name: "Consensus",
    description:
      "AI search engine for scientific research. Get evidence-based answers backed by peer-reviewed studies instantly.",
    category: "Research",
    url: "https://consensus.app",
    isFeatured: false,
  },
  {
    id: 21n,
    name: "Udio",
    description:
      "AI music generation tool that creates studio-quality songs from text descriptions. Supports remixing and vocal customization.",
    category: "Audio",
    url: "https://udio.com",
    isFeatured: false,
  },
  {
    id: 22n,
    name: "Krea AI",
    description:
      "Real-time AI image generation with sketch-to-image tools. Generate and enhance visuals with instant creative feedback.",
    category: "Image",
    url: "https://krea.ai",
    isFeatured: false,
  },
];

/* ─── Category config ─── */
const CATEGORIES = [
  { id: "All", label: "All Tools", icon: Sparkles, gradient: "cat-all" },
  { id: "Writing", label: "Writing", icon: PenLine, gradient: "cat-writing" },
  { id: "Image", label: "Image", icon: Star, gradient: "cat-image" },
  { id: "Code", label: "Code", icon: Code2, gradient: "cat-code" },
  { id: "Chat", label: "Chat", icon: MessageSquare, gradient: "cat-chat" },
  { id: "Video", label: "Video", icon: Video, gradient: "cat-video" },
  {
    id: "Research",
    label: "Research",
    icon: BookOpen,
    gradient: "cat-research",
  },
  { id: "Audio", label: "Audio", icon: Mic2, gradient: "cat-audio" },
];

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  Writing: "oklch(0.62 0.26 295 / 0.2)",
  Image: "oklch(0.65 0.26 345 / 0.2)",
  Code: "oklch(0.70 0.22 155 / 0.2)",
  Chat: "oklch(0.68 0.22 225 / 0.2)",
  Video: "oklch(0.75 0.22 65 / 0.2)",
  Research: "oklch(0.70 0.20 195 / 0.2)",
  Audio: "oklch(0.60 0.24 270 / 0.2)",
};

const CATEGORY_TEXT_COLORS: Record<string, string> = {
  Writing: "oklch(0.78 0.26 295)",
  Image: "oklch(0.82 0.22 345)",
  Code: "oklch(0.80 0.20 155)",
  Chat: "oklch(0.80 0.20 225)",
  Video: "oklch(0.85 0.18 65)",
  Research: "oklch(0.80 0.18 195)",
  Audio: "oklch(0.75 0.22 270)",
};

const CATEGORY_GRADIENT_CLASS: Record<string, string> = {
  Writing: "cat-writing",
  Image: "cat-image",
  Code: "cat-code",
  Chat: "cat-chat",
  Video: "cat-video",
  Research: "cat-research",
  Audio: "cat-audio",
  All: "cat-all",
};

const CATEGORY_VISIT_BTN_CLASS: Record<string, string> = {
  Writing: "visit-btn-writing",
  Image: "visit-btn-image",
  Code: "visit-btn-code",
  Chat: "visit-btn-chat",
  Video: "visit-btn-video",
  Research: "visit-btn-research",
  Audio: "visit-btn-audio",
};

const CATEGORY_CARD_HOVER_CLASS: Record<string, string> = {
  Writing: "card-hover-writing",
  Image: "card-hover-image",
  Code: "card-hover-code",
  Chat: "card-hover-chat",
  Video: "card-hover-video",
  Research: "card-hover-research",
  Audio: "card-hover-audio",
};

/* ─── Guide steps ─── */
const GUIDE_STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Find Your Tool",
    description:
      "Browse our curated collection of 20+ free AI tools. Use the search bar or filter by category to discover tools that match your specific needs.",
    accent: "oklch(0.62 0.26 295)",
  },
  {
    number: "02",
    icon: ExternalLink,
    title: "Visit & Explore",
    description:
      "Click the 'Visit Tool' button to open the AI tool in a new tab. All listed tools offer free tiers — no hidden fees to get started.",
    accent: "oklch(0.68 0.22 225)",
  },
  {
    number: "03",
    icon: Globe,
    title: "Create Free Account",
    description:
      "Most tools require a simple email signup. The free plans are generous — you can accomplish most tasks without ever paying a cent.",
    accent: "oklch(0.70 0.20 195)",
  },
  {
    number: "04",
    icon: Zap,
    title: "Start Prompting",
    description:
      "Describe what you want in plain English. Be specific about format, tone, and style. Experiment — great results come from iteration.",
    accent: "oklch(0.70 0.22 155)",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "Combine Multiple Tools",
    description:
      "The magic happens when you chain tools together: write with ChatGPT, visualize with Midjourney, code with Copilot, research with Perplexity.",
    accent: "oklch(0.65 0.26 345)",
  },
];

/* ─── Components ─── */

function Navbar({
  onScrollToTools,
  onScrollToGuide,
}: { onScrollToTools: () => void; onScrollToGuide: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-lg shadow-black/20" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg cat-all flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              AI Tools Hub
            </span>
          </motion.div>

          {/* Nav links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-1"
          >
            <button
              type="button"
              onClick={onScrollToTools}
              data-ocid="nav.tools.link"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
            >
              Tools
            </button>
            <button
              type="button"
              onClick={onScrollToGuide}
              data-ocid="nav.guide.link"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
            >
              Guide
            </button>
            <Button
              size="sm"
              onClick={onScrollToTools}
              data-ocid="nav.explore.button"
              className="ml-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 shadow-none transition-all duration-200"
            >
              Explore Free
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}

function GradientOrb({
  className,
  style,
}: { className: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none select-none ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

function HeroSection({
  searchQuery,
  onSearchChange,
}: { searchQuery: string; onSearchChange: (val: string) => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
        }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70" aria-hidden="true" />

      {/* Animated gradient orbs */}
      <GradientOrb
        className="w-96 h-96 top-10 left-[10%] animate-float"
        style={
          { background: "oklch(0.55 0.28 295 / 0.35)" } as React.CSSProperties
        }
      />
      <GradientOrb
        className="w-80 h-80 top-20 right-[15%] animate-float-reverse"
        style={
          { background: "oklch(0.60 0.24 220 / 0.3)" } as React.CSSProperties
        }
      />
      <GradientOrb
        className="w-64 h-64 bottom-20 left-[30%] animate-float-slow"
        style={
          { background: "oklch(0.65 0.22 180 / 0.25)" } as React.CSSProperties
        }
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-sm font-medium text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            20+ Free AI Tools — No Login Required
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-foreground mb-6"
        >
          Discover the Best{" "}
          <span
            className="animate-gradient inline-block"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.78 0.26 295), oklch(0.75 0.24 220), oklch(0.80 0.22 180), oklch(0.78 0.26 295))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Free AI Tools
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Explore 20+ powerful AI tools that are free to use — from writing
          assistants to image generators, code helpers to research engines.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-xl mx-auto"
        >
          <div className="relative group">
            <div
              className="absolute -inset-0.5 rounded-2xl opacity-60 group-focus-within:opacity-100 transition-opacity duration-300 animate-pulse-glow"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.62 0.26 295), oklch(0.68 0.22 225), oklch(0.72 0.20 180))",
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-center glass rounded-2xl px-4 py-3 gap-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search AI tools by name or category..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-ocid="hero.search_input"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
                aria-label="Search AI tools"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-muted-foreground"
        >
          {[
            { value: "22+", label: "Free Tools" },
            { value: "8", label: "Categories" },
            { value: "100%", label: "Free to Use" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5"
            >
              <span
                className="font-display font-black text-3xl leading-none"
                style={{
                  background: `linear-gradient(135deg, oklch(0.88 0.18 ${255 + i * 50}), oklch(0.78 0.24 ${285 + i * 50}))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </span>
              <span className="text-xs tracking-wide uppercase font-medium opacity-70">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-0.5 h-8 rounded-full bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}

function ToolCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card">
      <div className="h-1.5 animate-shimmer" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ToolCard({ tool, index }: { tool: AITool; index: number }) {
  const gradientClass = CATEGORY_GRADIENT_CLASS[tool.category] || "cat-all";
  const badgeBg =
    CATEGORY_BADGE_COLORS[tool.category] || "oklch(0.3 0.04 280 / 0.3)";
  const badgeColor =
    CATEGORY_TEXT_COLORS[tool.category] || "oklch(0.85 0.04 280)";
  const visitBtnClass =
    CATEGORY_VISIT_BTN_CLASS[tool.category] || "visit-btn-default";
  const cardHoverClass =
    CATEGORY_CARD_HOVER_CLASS[tool.category] || "card-hover-default";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      data-ocid={`tool.card.${index + 1}`}
      className={`group relative rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 ${cardHoverClass}`}
      style={{
        boxShadow:
          "0 2px 8px oklch(0 0 0 / 0.3), 0 8px 24px oklch(0 0 0 / 0.2)",
      }}
    >
      {/* Category gradient accent bar — 4px for visual presence */}
      <div className={`h-1 w-full ${gradientClass}`} aria-hidden="true" />

      {/* Subtle top-glow tint on hover — matches category */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% -10%, ${badgeBg} 0%, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative p-5 flex flex-col h-full">
        {/* Tool name & featured badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-lg text-foreground leading-tight tracking-tight">
            {tool.name}
          </h3>
          {tool.isFeatured && (
            <span
              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: "oklch(0.78 0.22 65 / 0.15)",
                color: "oklch(0.88 0.16 65)",
                border: "1px solid oklch(0.78 0.22 65 / 0.25)",
              }}
            >
              <Star className="w-2.5 h-2.5 fill-current" />
              Featured
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
          {tool.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: badgeBg, color: badgeColor }}
          >
            {tool.category}
          </span>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`tool.visit.button.${index + 1}`}
            className={`group/btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${visitBtnClass}`}
            aria-label={`Visit ${tool.name} — opens in new tab`}
          >
            Visit Tool
            <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedCard({ tool, index }: { tool: AITool; index: number }) {
  const gradientClass = CATEGORY_GRADIENT_CLASS[tool.category] || "cat-all";
  const badgeBg =
    CATEGORY_BADGE_COLORS[tool.category] || "oklch(0.3 0.04 280 / 0.3)";
  const badgeColor =
    CATEGORY_TEXT_COLORS[tool.category] || "oklch(0.85 0.04 280)";
  const cardHoverClass =
    CATEGORY_CARD_HOVER_CLASS[tool.category] || "card-hover-default";
  // First letter of tool name for the decorative watermark
  const initial = tool.name.charAt(0).toUpperCase();

  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      className={`group shrink-0 w-64 rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 cursor-pointer ${cardHoverClass}`}
      style={{
        boxShadow:
          "0 2px 8px oklch(0 0 0 / 0.3), 0 8px 24px oklch(0 0 0 / 0.18)",
      }}
      aria-label={`Visit ${tool.name}`}
    >
      {/* Gradient header — no dark overlay, large decorative letter */}
      <div
        className={`h-28 ${gradientClass} relative overflow-hidden flex items-end p-4`}
      >
        {/* Large decorative initial — purely typographic texture */}
        <span
          className="absolute -top-3 -right-2 font-display font-black text-8xl leading-none select-none pointer-events-none"
          style={{ color: "oklch(1 0 0 / 0.12)", letterSpacing: "-0.04em" }}
          aria-hidden="true"
        >
          {initial}
        </span>
        {/* Tool name */}
        <span className="relative font-display font-extrabold text-xl text-white leading-tight tracking-tight drop-shadow-sm z-10">
          {tool.name}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {tool.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: badgeBg, color: badgeColor }}
          >
            {tool.category}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Open
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}

function CategoryFilterBar({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 px-2"
        style={
          {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties
        }
        aria-label="Filter by category"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              data-ocid={`category.filter.${cat.id.toLowerCase()}.tab`}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? "text-white border-transparent shadow-lg"
                  : "text-muted-foreground border-border bg-card hover:border-primary/30 hover:text-foreground"
              }`}
              style={
                isActive
                  ? {
                      background:
                        cat.id === "All"
                          ? "linear-gradient(135deg, oklch(0.65 0.26 295), oklch(0.68 0.24 225), oklch(0.72 0.20 155))"
                          : undefined,
                      boxShadow: isActive
                        ? "0 4px 20px oklch(0.62 0.22 295 / 0.4)"
                        : undefined,
                    }
                  : {}
              }
              aria-pressed={isActive}
              aria-label={`Filter by ${cat.label}`}
            >
              {isActive && cat.id !== "All" && (
                <span
                  className={`inline-block w-4 h-4 rounded ${cat.gradient}`}
                  aria-hidden="true"
                />
              )}
              {(!isActive || cat.id === "All") && <Icon className="w-4 h-4" />}
              {cat.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({
  searchQuery,
  category,
}: { searchQuery: string; category: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      data-ocid="tools.empty_state"
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl glass border border-border flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground mb-2">
        No tools found
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {searchQuery
          ? `No tools match "${searchQuery}"${category !== "All" ? ` in ${category}` : ""}. Try a different search or category.`
          : `No tools in the ${category} category yet. Check back soon!`}
      </p>
    </motion.div>
  );
}

function GuideSection() {
  return (
    <section
      id="guide"
      data-ocid="guide.section"
      className="py-24 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-sm font-medium text-primary mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Beginner Friendly
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground mt-3 mb-4">
            How to Use AI Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            New to AI? No problem. Here's your step-by-step guide to getting
            started with the most powerful free tools available today.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {GUIDE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex items-start gap-5 p-6 rounded-2xl glass border border-border hover:border-primary/25 transition-all duration-300"
              >
                {/* Step number + icon */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `${step.accent}20`,
                      border: `1px solid ${step.accent}40`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: step.accent }} />
                  </div>
                  <span
                    className="font-display font-black text-xs"
                    style={{ color: `${step.accent}80` }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow on hover */}
                <div className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight
                    className="w-5 h-5"
                    style={{ color: step.accent }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="w-6 h-6 rounded-md cat-all flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-semibold text-foreground">
            AI Tools Hub
          </span>
          <span>— Free AI tools for everyone</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const toolsRef = useRef<HTMLElement>(null);
  const guideRef = useRef<HTMLElement>(null);

  const { data: backendTools, isLoading } = useGetAllTools();
  const { data: featuredBackend, isLoading: featuredLoading } =
    useGetFeaturedTools();

  // Use backend data if available, fall back to static
  const allTools = useMemo(() => {
    if (backendTools && backendTools.length > 0) return backendTools;
    return STATIC_TOOLS;
  }, [backendTools]);

  const featuredTools = useMemo(() => {
    if (featuredBackend && featuredBackend.length > 0) return featuredBackend;
    return STATIC_TOOLS.filter((t) => t.isFeatured).slice(0, 6);
  }, [featuredBackend]);

  // Filtered tools
  const filteredTools = useMemo(() => {
    let result = allTools;

    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allTools, activeCategory, searchQuery]);

  const scrollToTools = () =>
    toolsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToGuide = () =>
    guideRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onScrollToTools={scrollToTools} onScrollToGuide={scrollToGuide} />

      {/* Hero */}
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-divider" aria-hidden="true" />
      </div>

      {/* Featured Tools */}
      <section
        id="featured"
        data-ocid="featured.section"
        ref={toolsRef}
        className="py-16 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-start gap-3">
              {/* Left accent bar */}
              <div
                className="mt-1.5 w-1 h-8 rounded-full cat-all shrink-0"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground mb-1 leading-tight">
                  Featured Tools
                </h2>
                <p className="text-muted-foreground text-sm">
                  The most popular AI tools loved by millions
                </p>
              </div>
            </div>
            <span
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "oklch(0.78 0.22 65 / 0.12)",
                color: "oklch(0.88 0.16 65)",
                border: "1px solid oklch(0.78 0.22 65 / 0.22)",
              }}
            >
              <Star className="w-3 h-3 fill-current" />
              Top Picks
            </span>
          </motion.div>

          {/* Horizontal scroll */}
          <div className="relative">
            <div
              className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="flex gap-4 overflow-x-auto pb-4"
              style={
                {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                } as React.CSSProperties
              }
            >
              {featuredLoading
                ? ["s1", "s2", "s3", "s4", "s5", "s6"].map((sk) => (
                    <div
                      key={sk}
                      className="shrink-0 w-60 rounded-2xl overflow-hidden border border-border bg-card"
                    >
                      <div className="h-24 animate-shimmer" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))
                : featuredTools.map((tool, i) => (
                    <FeaturedCard key={String(tool.id)} tool={tool} index={i} />
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-divider" aria-hidden="true" />
      </div>

      {/* Main Tools Section */}
      <section className="py-12 px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-start gap-3"
          >
            <div
              className="mt-1.5 w-1 h-8 rounded-full shrink-0"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.68 0.22 225), oklch(0.72 0.20 155))",
              }}
              aria-hidden="true"
            />
            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground mb-1 leading-tight">
                All AI Tools
              </h2>
              <p className="text-muted-foreground text-sm">
                Filter by category or search to find exactly what you need
              </p>
            </div>
          </motion.div>

          {/* Category filter bar */}
          <div className="mb-8">
            <CategoryFilterBar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Results count */}
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.p
                key={`count-${filteredTools.length}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground mb-5"
              >
                {filteredTools.length}{" "}
                {filteredTools.length === 1 ? "tool" : "tools"} found
                {activeCategory !== "All" && ` in ${activeCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Tools grid */}
          <div
            data-ocid="tools.grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {isLoading ? (
              ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"].map(
                (sk) => <ToolCardSkeleton key={sk} />,
              )
            ) : filteredTools.length === 0 ? (
              <EmptyState searchQuery={searchQuery} category={activeCategory} />
            ) : (
              filteredTools.map((tool, i) => (
                <ToolCard key={String(tool.id)} tool={tool} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-divider" aria-hidden="true" />
      </div>

      {/* Guide */}
      <GuideSection />

      <Footer />
    </div>
  );
}
