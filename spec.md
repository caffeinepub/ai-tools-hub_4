# AI Tools Hub

## Current State
New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add
- Landing page app showcasing popular free AI tools globally
- Hero banner section with welcoming headline, tagline, and call-to-action
- Searchable and filterable grid of AI tool cards (tool name, description, category tag, visit link)
- Category filter bar (All, Writing, Image, Code, Chat, Video, Research, Audio)
- "How to Use AI Tools" beginner guide section with step-by-step tips
- No login required - fully public

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend
- Store AI tool entries: id, name, description, category, url, isFeatured flag
- Query: getAllTools, getToolsByCategory, searchTools
- Seed with ~20 popular free AI tools (ChatGPT, Gemini, Perplexity, Copilot, Claude, Midjourney, DALL-E, Stable Diffusion, GitHub Copilot, Replit, Runway, Suno, Otter.ai, Grammarly, Jasper, Notion AI, Canva AI, Adobe Firefly, ElevenLabs, Pika)

### Frontend
- Single-page app (React + TypeScript)
- Hero section: bold headline, subtitle, animated gradient background, search bar CTA
- Category filter bar: horizontal scrollable pill buttons (All, Writing, Image, Code, Chat, Video, Research, Audio)
- Tool card grid: responsive masonry/grid, each card has icon/logo placeholder, name, description, category badge, "Visit Tool" button
- Search: real-time text filter across tool name and description
- Beginner guide section: numbered steps with icons explaining how to get started with AI tools
- Footer: brief about text and links
- Mobile-friendly responsive layout
- Smooth animations: card hover effects, filter transitions, hero gradient animation
