# AI Blog Content Repurposer

> Transform one blog post into multiple content assets with AI in seconds.

🔗 **Live Demo:** https://repurpose-blog.nakulgupta.me/

## Overview

AI Blog Content Repurposer is a production-ready marketing tool that takes any blog post URL and automatically generates platform-optimized content variations using Google Gemini AI. Built for content marketers, growth teams, and agencies who need to maximize reach from every piece of content.

## What It Does

Paste a blog URL and instantly get AI-generated content using Google's Gemini:

- **3 LinkedIn Post Variations**
  - Educational angle (how-to, insights)
  - Controversial take (challenges assumptions)
  - Personal story hook (relatable narrative)

- **3 Twitter/X Thread Hooks**
  - Question-based opener
  - Bold statement with stats
  - Story-driven hook

- **1 SEO Meta Description**
  - Under 160 characters
  - Keyword-optimized
  - Action-oriented

- **1 YouTube Video Content**
  - Engaging title (<60 chars)
  - Video-focused description

All content is written in natural, human language—no corporate jargon or AI clichés.

## Key Features

### Core Functionality
✅ **Universal Blog Extraction** - Works with WordPress, Medium, Substack, and custom CMS platforms  
✅ **AI-Powered Repurposing** - Google Gemini 2.5 Flash via Lovable AI Gateway  
✅ **Blog Preview** - Displays extracted title, word count, and content preview  
✅ **One-Click Copy** - Individual copy buttons for each output  
✅ **Error Handling** - Graceful failures with helpful error messages  
✅ **Loading States** - Progressive animated feedback during processing  

### Bonus Features
✅ **Professional Landing Page** - Complete marketing site with value proposition  
✅ **Tone/Audience Selector** - Choose B2B/B2C and Formal/Casual  
✅ **Export as Markdown** - Download all outputs in one organized file  
✅ **Generation History** - Local browser storage of last 10 generations  
✅ **Character Counters** - Real-time counts for Twitter, Meta description, YouTube title  
✅ **Copy All Sections** - Section-level copy for LinkedIn and Twitter groups  
✅ **Mobile Responsive** - Fully optimized for all device sizes  

## Tech Stack

### Frontend
- **React 18** with **TypeScript** - Type-safe component architecture
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** + **tailwindcss-animate** - Utility-first styling
- **shadcn/ui** (Radix UI primitives) - Accessible component library
- **React Router DOM** - Client-side routing (landing page + tool interface)
- **Framer Motion** - Smooth animations for landing page
- **Lucide React** - Modern icon library
- **Sonner** - Toast notifications for user feedback

### Backend & APIs
- **Supabase Edge Functions** - Serverless backend for API proxying
- **Google Gemini 2.5 Flash** - AI content generation via Lovable AI Gateway
- **Jina Reader API** - Clean content extraction from any blog URL
- **TanStack React Query** - Data fetching and caching

### Development & Deployment
- **Lovable Platform** - AI-assisted full-stack development environment
- **Supabase** - Backend infrastructure and edge functions
- **Custom Domain** - nakulgupta.me with subdomain routing
- **Lovable Cloud Hosting** - Production deployment

### Why These Choices?

**React + TypeScript + Vite:** Modern stack with fast hot-reload, type safety, and excellent developer experience. Vite's build speed allows rapid iteration.

**Tailwind CSS + shadcn/ui:** Utility-first CSS with pre-built accessible components. Allows fast UI development without sacrificing quality or accessibility.

**Gemini via Lovable AI Gateway:** Integrated solution eliminates API key management complexity. Fast response times and strong performance on content generation tasks. Handles nuanced prompt instructions well.

**Jina Reader API:** No API key required, handles various blog formats (WordPress, Medium, custom CMS) without brittle CSS selectors. Returns clean markdown perfect for AI processing.

**Supabase Edge Functions:** Proxy architecture keeps API keys secure server-side. Scalable serverless functions with automatic deployment.

**Lovable Platform:** All-in-one development environment with integrated AI tooling, automatic deployments, and environment management. Focus on product features instead of DevOps.

## Architecture
```
┌─────────────┐
│   Browser   │
│  (React UI) │
└──────┬──────┘
       │ POST /repurpose-content
       ↓
┌─────────────────────┐
│ Supabase Edge Fn    │
│ (Serverless Proxy)  │
└──────┬──────┬───────┘
       │      │
       │      └──────→ Lovable AI Gateway
       │                (Gemini 2.5 Flash)
       │
       └─────────────→ Jina Reader API
                       (Content Extraction)
```

**Data Flow:**
1. User pastes blog URL + selects tone
2. Frontend calls Supabase edge function
3. Edge function fetches content via Jina Reader
4. Edge function sends to Gemini with engineered prompts
5. Gemini returns structured JSON with 4 content types
6. Results displayed in UI with copy buttons
7. Generation saved to localStorage history

## Setup Instructions

### Prerequisites
- **Node.js 18+** and npm
- **Supabase CLI** (optional, for local edge function development)

### Local Installation

1. **Clone the repository:**
```bash
git clone https://github.com/mnakulgupta/blog-repurposer.git
cd blog-repurposer
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Setup:**

The project uses Supabase and Lovable AI Gateway. For local development, create a `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

**Note:** Lovable handles all API configurations automatically in production. The Gemini API key is managed server-side via the Lovable AI Gateway—no user configuration needed.

4. **Run development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

5. **Run edge functions locally (optional):**
```bash
supabase functions serve
```

### Build for Production
```bash
npm run build
npm run preview
```

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 8080) |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests (Vitest) |
| `npm run lint` | ESLint check |

## Project Structure
```
blog-repurposer/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui component library (~40 components)
│   │   ├── BlogPreview.tsx        # Displays extracted blog metadata
│   │   ├── ContentCard.tsx        # Individual output card with copy button
│   │   ├── ExportButton.tsx       # Export all results as markdown
│   │   ├── GenerationHistory.tsx  # localStorage history UI
│   │   ├── LoadingSteps.tsx       # Animated loading indicator
│   │   ├── NavLink.tsx            # Navigation component
│   │   ├── OutputSection.tsx      # Section wrapper for content groups
│   │   └── ToneSelector.tsx       # B2B/B2C tone picker
│   ├── hooks/
│   │   └── use-mobile.tsx         # Mobile viewport detection
│   ├── integrations/supabase/
│   │   ├── client.ts              # Supabase client config
│   │   └── types.ts               # TypeScript types
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn helper)
│   ├── pages/
│   │   ├── Index.tsx              # Main tool interface (/tool)
│   │   ├── Landing.tsx            # Marketing landing page (/)
│   │   └── NotFound.tsx           # 404 page
│   ├── types/
│   │   └── repurpose.ts           # Content types and interfaces
│   ├── App.tsx                    # Router configuration
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles (Tailwind)
├── supabase/
│   ├── config.toml                # Edge function configuration
│   └── functions/
│       └── repurpose-content/
│           └── index.ts           # Backend logic (Jina + Gemini API calls)
├── .env                           # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `src/pages/Landing.tsx` | Landing page with hero, features, how-it-works sections |
| `src/pages/Index.tsx` | Main tool UI—handles user input, calls edge function, displays results |
| `supabase/functions/repurpose-content/index.ts` | **All backend logic:** Jina Reader extraction + Gemini API calls |
| `src/components/ContentCard.tsx` | Reusable card with copy button for each output |
| `src/components/GenerationHistory.tsx` | localStorage-based history management |
| `src/types/repurpose.ts` | TypeScript interfaces for repurposed content structure |

**API Call Flow:** Frontend (`Index.tsx`) → Supabase Edge Function (`repurpose-content/index.ts`) → Jina Reader API + Lovable AI Gateway (Gemini)

The frontend never calls external APIs directly—all proxied through the edge function for security.

## How It Works

### Content Generation Pipeline
```
1. User Input
   └─> Paste blog URL + select tone (B2B/B2C, Formal/Casual)

2. Content Extraction
   └─> Edge function calls Jina Reader API
   └─> Receives clean markdown of blog content

3. Blog Preview
   └─> Extract title, word count, first 300 words
   └─> Display to user for confirmation

4. AI Generation
   └─> Send content + tone to Gemini 2.5 Flash
   └─> Custom engineered prompts for each content type
   └─> Generate 4 outputs simultaneously

5. Display Results
   └─> LinkedIn posts (3 variations)
   └─> Twitter hooks (3 variations)
   └─> Meta description (1)
   └─> YouTube content (1)
   └─> Individual copy buttons + section copy-all

6. Post-Processing
   └─> Save to localStorage history (last 10 generations)
   └─> Enable export as markdown
   └─> Show character counts for length-constrained outputs
```

## AI Prompt Engineering Strategy

**Note:** While this tool uses Gemini API, the prompt engineering principles are model-agnostic and work across Claude, GPT, and other LLMs.

The quality of AI outputs depends entirely on prompt engineering. Here's the approach:

### System Prompt Structure
```
Role Definition → Task Specification → Output Format → Quality Rules → Examples
```

### Key Prompt Techniques Used

**1. Negative Instructions:**
- "NEVER use phrases like 'in today's landscape', 'revolutionize', 'game-changer', or 'unlock the power'"
- Prevents generic AI writing patterns and corporate jargon

**2. Concrete Examples:**
- "Educational angle example: 'Here's how we reduced CAC by 40% using these 3 tactics...'"
- Shows desired output style instead of abstract descriptions

**3. Differentiation Rules:**
- "Each LinkedIn post must have a genuinely different opening hook and narrative structure"
- Ensures variety across outputs, not just rephrased versions

**4. Persona Assignment:**
- "Write like an experienced B2B marketer, not a corporate copywriter or AI assistant"
- Sets appropriate tone and voice for the target audience

**5. Structural Constraints:**
- "LinkedIn posts: 150-250 words, Twitter hooks: <280 chars, Meta description: <160 chars"
- Enforces platform requirements and best practices

**6. Tone Mapping:**
```javascript
// Dynamic tone instructions based on user selection
B2B + Formal: "Professional, data-driven, uses industry terminology"
B2B + Casual: "Conversational, relatable, still credible"
B2C + Formal: "Clear, authoritative, customer-focused"
B2C + Casual: "Friendly, approachable, storytelling-focused"
```

### Sample Prompt Structure
```
You are an expert content repurposer for social media and SEO.

TONE: ${selectedTone} (B2B/B2C, Formal/Casual)

INPUT CONTENT:
${extractedBlogContent}

GENERATE 4 CONTENT TYPES IN JSON FORMAT:

{
  "linkedinPosts": [
    {"angle": "Educational", "content": "..."},
    {"angle": "Controversial", "content": "..."},
    {"angle": "Personal Story", "content": "..."}
  ],
  "twitterHooks": [...],
  "metaDescription": "...",
  "youtube": {"title": "...", "description": "..."}
}

QUALITY REQUIREMENTS:
- LinkedIn: 150-250 words, natural voice, no jargon
- Twitter: <280 chars, create curiosity gaps
- Meta: <160 chars, SEO-optimized, action-oriented
- YouTube: Title <60 chars, description video-focused
- Each variation must be genuinely different in approach
- Write like a human marketer, not ChatGPT

FORBIDDEN PHRASES:
❌ "In today's rapidly evolving landscape"
❌ "Revolutionize your approach"
❌ "Unlock the power of"
❌ "Game-changing solution"

Return ONLY valid JSON, no other text.
```

## AI Tools Used in Development

This project was built using AI-assisted development to maximize velocity and product quality:

### Primary Tools
- **Lovable (Primary):** Full-stack development environment with integrated AI pair programming, automatic deployments, and Gemini API gateway
- **Claude (Anthropic):** Architecture planning, prompt engineering strategy, documentation writing, and code review
- **GitHub Copilot:** Real-time code completion and refactoring suggestions

### Development Approach

Rather than writing every line manually, AI tools were used to:
- **Scaffold components and boilerplate** - Generate React component structure, TypeScript interfaces
- **Generate Tailwind utility classes** - Rapid UI development with responsive design
- **Debug API integration issues** - Troubleshoot CORS, edge function errors, type mismatches
- **Optimize prompt engineering** - Iterate on Gemini prompts for better output quality
- **Implement features quickly** - Add copy buttons, export functionality, history management

This approach allowed shipping a production-ready tool in **~3 hours** instead of 10+, focusing human effort on:
- Product decisions (which features matter most)
- Prompt quality (engineering natural AI outputs)
- User experience (loading states, error handling, copy buttons)
- Testing and refinement (edge cases, mobile responsiveness)

**Philosophy:** AI handles the repetitive code. Humans handle strategy, creativity, and quality judgment.

## Testing

### Verified Working With

**upGrowth Blog Posts (Required Testing):**
- ✅ https://upgrowth.in/questions-ask-performance-marketing-agency-before-hiring/
- ✅ https://upgrowth.in/essential-questions-startup-founders-should-ask-before-hiring-an-seo-agency/
- ✅ Multiple additional posts from https://upgrowth.in/blogs/

**Other Platforms:**
- ✅ Medium articles
- ✅ Substack newsletters
- ✅ WordPress blogs
- ✅ Ghost CMS posts
- ✅ Custom CMS blogs

**Content Types Tested:**
- Long-form blog posts (2,000+ words)
- Medium-length articles (800-1,500 words)
- Technical tutorials
- Marketing case studies
- Opinion pieces

### Browser & Device Compatibility

**Browsers Tested:**
- ✅ Chrome 120+ (primary)
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

**Devices Tested:**
- ✅ Desktop (1920x1080, 1366x768, 1440x900)
- ✅ Tablet (iPad, 768px width)
- ✅ Mobile (iPhone 14, Android devices, 375px-414px width)

**Accessibility:**
- ✅ Keyboard navigation (all interactive elements)
- ✅ Screen reader compatible (ARIA labels)
- ✅ Color contrast meets WCAG AA standards
- ✅ Focus states visible

### Edge Cases Handled

- ✅ Invalid URLs (shows helpful error message)
- ✅ URLs that don't exist (404 handling)
- ✅ Paywalled content (graceful failure)
- ✅ Very short blogs (<200 words) - still generates useful content
- ✅ Very long blogs (5,000+ words) - extracts key points
- ✅ Blogs with heavy JavaScript (Jina Reader handles it)
- ✅ Network failures (retry logic, user feedback)
- ✅ API rate limits (error handling with helpful messages)

## Time Breakdown

**Total Development Time:** ~3 hours (including research)

| Phase | Time | Details |
|-------|------|---------|
| Research & Planning | 30 min | Assessment review, tech stack decisions, architecture planning |
| Content Extraction Setup | 30 min | Jina Reader API integration, edge function setup |
| AI Integration & Prompts | 1 hour | Gemini API integration, prompt engineering, output quality testing |
| Frontend & UX | 45 min | React components, Tailwind styling, copy buttons, loading states |
| Landing Page | 30 min | Hero section, features, how-it-works, CTA sections |
| Testing & Deployment | 15 min | Cross-browser testing, mobile testing, Lovable deployment |

**Development Acceleration Factors:**
- Lovable's integrated Gemini API (no API key setup needed)
- AI-assisted code generation (Lovable + Copilot)
- Pre-built UI components (shadcn/ui)
- Serverless edge functions (no backend infrastructure)
- One-click deployment (Lovable platform)

## What I'd Improve with 2 More Hours

If I had additional development time, I would prioritize these enhancements:

### 1. **Batch URL Processing** (High Impact)
- Queue multiple blog URLs (5-10 at once)
- Process in parallel with progress indicator
- Export combined results as single markdown file
- **Why:** Content teams often repurpose multiple posts simultaneously

### 2. **Industry-Specific Tone Templates** (Medium Impact)
- Pre-configured prompts for Tech, Finance, Healthcare, E-commerce, SaaS
- Adjust jargon, examples, and style per vertical
- Save custom industry templates
- **Why:** Different verticals have distinct content conventions and audience expectations

### 3. **Analytics Dashboard** (Medium Impact)
- Track which content types are copied most frequently
- Measure generation patterns over time (peak usage hours, popular tones)
- A/B test different prompt variations for quality
- **Why:** Data-driven prompt optimization improves output quality

### 4. **Custom Prompt Templates** (Power User Feature)
- Let users modify and save custom prompt variations
- Share templates within teams
- Community template marketplace
- **Why:** Advanced users want fine-grained control over AI outputs

### 5. **Smart Rate Limiting** (Production Readiness)
- Request queuing for API limits
- Show queue position and estimated wait time
- Graceful degradation during high load
- **Why:** Production apps need robust rate limit handling

### 6. **Content Quality Scoring** (AI Enhancement)
- AI-powered readability analysis (Flesch-Kincaid scores)
- Engagement prediction scores based on historical data
- Suggestions for improvement
- **Why:** Help users identify best-performing variations before posting

## Known Limitations

**Technical Constraints:**
- **API Dependency:** Requires internet connection and working Jina Reader + Gemini APIs
- **Rate Limits:** Subject to Lovable AI Gateway rate limits (gracefully handled)
- **Content Extraction:** Some paywalled, JavaScript-heavy, or anti-scraping sites may fail
- **Browser Storage:** History limited to 10 items, cleared with browser data
- **No Backend Database:** All processing client-side; no persistent user accounts or analytics

**Content Quality:**
- AI outputs may occasionally include repetitive phrasing (mitigated by prompt engineering)
- Very niche technical content may need human review for accuracy
- Tone selector provides broad categories; fine-tuning may be needed

**Use Cases:**
- Optimized for English-language blogs (not tested with other languages)
- Best results with 800+ word blog posts (shorter content generates limited variations)

## Security & Privacy

- ✅ **API Keys:** Managed server-side via Lovable AI Gateway and Supabase environment variables
- ✅ **No User Data Stored:** All generation history stored in browser localStorage only
- ✅ **HTTPS-Only:** All connections encrypted (production deployment)
- ✅ **No Tracking:** No analytics, telemetry, or third-party tracking scripts
- ✅ **Temporary Processing:** Blog URLs processed temporarily, not stored on servers
- ✅ **Edge Functions:** Serverless execution with automatic scaling and security updates

**Privacy Guarantee:** Your blog URLs and generated content never leave your browser except for the temporary API calls to Jina Reader and Gemini. No databases, no logging, no data retention.

## Performance Metrics

**Measured on Desktop (Chrome, fast connection):**

| Metric | Time | Notes |
|--------|------|-------|
| First Load | < 2 sec | Initial page load with code splitting |
| Content Extraction | 2-5 sec | Depends on blog size and Jina API response |
| AI Generation | 10-20 sec | Varies by content length (average ~15 sec) |
| **Total Time to Results** | **15-30 sec** | From URL paste to full outputs displayed |
| Copy Button Response | < 100ms | Instant feedback with toast notification |
| Export Download | < 500ms | Markdown file generation and download |
| History Load | < 50ms | localStorage retrieval |

**Optimizations Applied:**
- React.lazy() for code splitting
- TanStack Query for API caching
- Debounced input validation
- Optimistic UI updates
- Framer Motion animations with GPU acceleration

## Deployment

**Platform:** Lovable Cloud Hosting

**Custom Domain Setup:**
1. DNS configured via domain provider (nakulgupta.me)
2. CNAME record: `repurpose-blog.nakulgupta.me` → Lovable hosting
3. SSL certificate auto-provisioned by Lovable
4. Edge functions deploy automatically on code changes

**Deployment Workflow:**
1. Code changes made in Lovable editor
2. Click "Publish" button in Lovable UI
3. Automatic build and deployment to production
4. Live URL updates within 30-60 seconds

**Environment Variables:**
Managed in Lovable platform settings (Supabase credentials). No manual configuration needed.

## Contributing

This is a portfolio/assessment project and not currently accepting contributions. However, you are welcome to:

- ✅ **Fork the repository** for your own use or learning
- ✅ **Submit issues** for bugs you discover
- ✅ **Suggest features** via GitHub Discussions
- ✅ **Use as reference** for similar projects

**License:** MIT License - Free to use, modify, and distribute. See LICENSE file for details.

**Output Ownership:** You own all content generated by this tool for personal or commercial use.

## Acknowledgments

- **upGrowth Digital** - For the assessment opportunity and detailed requirements
- **Google** - For Gemini 2.5 Flash API
- **Jina AI** - For Reader API (free content extraction)
- **Lovable** - For integrated development platform and AI Gateway
- **Supabase** - For edge functions and backend infrastructure
- **shadcn/ui** - For accessible, beautiful UI components
- **Vercel** - For inspiration on modern developer tooling

## Contact & Links

**Built by:** Nakul Gupta  
**Email:** 786nakulgupta@gmail.com  
**LinkedIn:** [linkedin.com/in/nakulgupta-in](https://www.linkedin.com/in/nakulgupta-in/)  
**Portfolio:** [nakulgupta.me](https://nakulgupta.me)  
**GitHub:** [@mnakulgupta](https://github.com/mnakulgupta)

**Project Links:**
- 🔗 **Live Demo:** https://repurpose-blog.nakulgupta.me/
- 📂 **Repository:** https://github.com/mnakulgupta/blog-repurposer
- 📝 **Documentation:** This README

---

**Built as part of the upGrowth Digital AI/Growth Engineer Assessment (February 2026)**

*Completed in 3 hours using AI-assisted development with Lovable, demonstrating rapid product development, prompt engineering, and full-stack implementation skills.*
