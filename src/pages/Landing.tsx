import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, ChevronDown, Clock, Frown, TrendingDown, RefreshCw,
  Linkedin, Twitter, Search, Youtube, Zap, Clipboard, History, Palette, Brain, Smartphone,
  PenTool, Rocket, Edit3, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tight">AI Blog Repurposer</span>
          </Link>
          <Link to="/tool">
            <Button size="sm" className="gap-1.5 rounded-full px-5">
              Try It Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ───── HERO ───── */}
      <section className="relative isolate">
        {/* gradient bg */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-28 lg:py-36">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Free &amp; Instant
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Transform One Blog Post Into{" "}
              <span className="bg-gradient-to-r from-primary to-[hsl(250,70%,56%)] bg-clip-text text-transparent">
                Multiple Content Assets
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Turn your blog content into LinkedIn posts, Twitter threads, meta descriptions, and YouTube scripts — automatically in seconds.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/tool">
                <Button size="lg" className="rounded-full px-8 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base gap-2">
                  See How It Works <ChevronDown className="h-5 w-5" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── PROBLEM ───── */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">
              Creating Content Is Time-Consuming
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-muted-foreground">
              You've written a great blog post — now you need it on five other platforms. Sound familiar?
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, text: "Hours spent repurposing one post" },
              { icon: Frown, text: "Struggling with different formats" },
              { icon: TrendingDown, text: "Inconsistent posting across platforms" },
              { icon: RefreshCw, text: "Manual copy-paste across tools" },
            ].map(({ icon: Icon, text }) => (
              <motion.div key={text} variants={fadeUp} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── SOLUTION ───── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">
              One URL. Multiple Outputs.{" "}
              <span className="text-primary">In Under 30 Seconds.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Paste any blog URL and instantly get ready-to-post content for every platform.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Linkedin, label: "3 LinkedIn post variations" },
              { icon: Twitter, label: "3 Twitter thread hooks" },
              { icon: Search, label: "SEO meta description" },
              { icon: Youtube, label: "YouTube title + description" },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={fadeUp} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium leading-snug">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="bg-muted/40 py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">How It Works</motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-lg text-muted-foreground">Three simple steps to multiply your content reach.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              { step: "1", title: "Paste URL", desc: "Simply paste any blog post URL into the input field." },
              { step: "2", title: "AI Analyzes", desc: "Our AI reads and understands your content in seconds." },
              { step: "3", title: "Get Content", desc: "Copy or export your repurposed content for every platform." },
            ].map(({ step, title, desc }) => (
              <motion.div key={step} variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg shadow-primary/20">
                  {step}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Features You'll Love</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Palette, title: "Multiple Tone Options", desc: "Choose B2B/B2C, Formal/Casual to match your brand voice." },
              { icon: Clipboard, title: "One-Click Copy", desc: "Copy individual pieces or export everything at once." },
              { icon: History, title: "Generation History", desc: "Access your previously generated content anytime." },
              { icon: Zap, title: "Lightning Fast", desc: "Get results in under 30 seconds, not hours." },
              { icon: Brain, title: "Smart AI Writing", desc: "Content that sounds human, not robotic." },
              { icon: Smartphone, title: "Works Everywhere", desc: "Fully responsive, works on any device." },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── USE CASES ───── */}
      <section className="bg-muted/40 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="text-center">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Perfect For</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: PenTool, title: "Content Marketers", desc: "Repurpose blog content across channels." },
              { icon: Rocket, title: "Growth Teams", desc: "Maximize reach from every piece of content." },
              { icon: Edit3, title: "Writers & Creators", desc: "Extend your content's lifespan effortlessly." },
              { icon: Building2, title: "Agencies", desc: "Scale content production for clients." },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative isolate py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-primary/5 via-background to-background" />
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Ready to 10× Your Content Output?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
              Stop copying and pasting. Start repurposing in seconds.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link to="/tool">
                <Button size="lg" className="rounded-full px-10 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                  Get Started Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Blog Content Repurposer</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Built with ❤️ for content creators
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} — Made for upGrowth Assessment
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
