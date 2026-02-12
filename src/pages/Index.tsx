import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Linkedin, Twitter, Search, Youtube, Sparkles, AlertCircle, RefreshCw,
  Link as LinkIcon, Info, ClipboardPaste, Mail, Instagram, ToggleLeft, ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ContentCard from "@/components/ContentCard";
import OutputSection from "@/components/OutputSection";
import BlogPreview from "@/components/BlogPreview";
import ToneSelector from "@/components/ToneSelector";
import ExportButton from "@/components/ExportButton";
import LoadingSteps from "@/components/LoadingSteps";
import HistorySidebar, { saveToHistory } from "@/components/HistorySidebar";
import EmptyState from "@/components/EmptyState";

import type { RepurposedContent, ToneOption } from "@/types/repurpose";

const Index = () => {
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState<ToneOption>("b2b-formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RepurposedContent | null>(null);
  const [activeUrl, setActiveUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [fromHistory, setFromHistory] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualText, setManualText] = useState("");

  const isValidUrl = (str: string) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const handleSubmit = async () => {
    setError(null);
    setFromHistory(null);
    if (!url.trim()) { setError("Please enter a blog URL"); return; }
    if (!isValidUrl(url)) { setError("Invalid URL format. Please enter a complete URL starting with http:// or https://"); return; }
    if (isManualMode && manualText.trim().length < 200) { setError("Please paste at least 200 characters of blog content."); return; }

    setLoading(true);
    setResult(null);

    const body: Record<string, string> = { url, tone };
    if (isManualMode && manualText.trim()) {
      body.manualText = manualText.trim();
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("repurpose-content", { body });

      if (fnError) { setError(fnError.message || "Something went wrong. Please try again."); return; }
      if (data?.error === "EXTRACTION_FAILED") {
        setIsManualMode(true);
        setError(data.message || "Automatic extraction failed. Please paste the article text manually.");
        return;
      }
      if (data?.error) { setError(data.error); return; }

      const content = data as RepurposedContent;
      setResult(content);
      setActiveUrl(url);
      setLastGenerated(new Date().toLocaleTimeString());

      saveToHistory({
        url,
        timestamp: Date.now(),
        tone,
        previewTitle: content.blogMeta?.title || url,
        result: content,
      });

      toast.success("Content generated successfully!");
    } catch {
      setError("Unable to connect. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (histResult: RepurposedContent, histUrl: string) => {
    setResult(histResult);
    setActiveUrl(histUrl);
    setUrl(histUrl);
    setFromHistory(new Date().toLocaleTimeString());
  };

  const handleNewGeneration = () => {
    setResult(null);
    setUrl("");
    setActiveUrl("");
    setFromHistory(null);
    setError(null);
    setManualText("");
    setIsManualMode(false);
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <HistorySidebar
        onSelect={handleHistorySelect}
        onNewGeneration={handleNewGeneration}
        activeUrl={activeUrl}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                AI Blog Repurposer
              </h1>
            </Link>
            <div className="flex items-center gap-3">
              {lastGenerated && (
                <span className="hidden sm:block text-xs text-muted-foreground">
                  Last: {lastGenerated}
                </span>
              )}
              <ToneSelector value={tone} onChange={setTone} disabled={loading} />
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 space-y-6">
          {/* Input area */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
            {/* Mode toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Input Mode:</span>
              <button
                onClick={() => { setIsManualMode(!isManualMode); setError(null); }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {isManualMode ? (
                  <><ToggleRight className="h-5 w-5 text-primary" /> Manual Paste</>
                ) : (
                  <><ToggleLeft className="h-5 w-5" /> Auto-Extract from URL</>
                )}
              </button>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(null); }}
                  placeholder={isManualMode ? "Blog URL (for reference)..." : "Paste your blog post URL here..."}
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={loading || (isManualMode && manualText.trim().length < 200)}
                className="gap-2 min-w-[140px]"
              >
                {loading ? "Generating..." : "Generate Content"}
              </Button>
            </div>

            {/* Manual paste area */}
            {isManualMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ClipboardPaste className="h-4 w-4 text-primary" />
                  Paste Blog Content Here
                </label>
                <Textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Copy the full article text from the blog post and paste it here..."
                  className="min-h-[180px]"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  {manualText.length} characters {manualText.length < 200 && manualText.length > 0 ? `(need at least 200)` : ""}
                </p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={() => { setError(null); handleSubmit(); }} className="gap-1.5 shrink-0 ml-3">
                  <RefreshCw className="h-3.5 w-3.5" /> Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading */}
          {loading && <LoadingSteps />}

          {/* History loaded banner */}
          {fromHistory && result && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Showing previously generated content</span>
                <Button variant="ghost" size="sm" onClick={() => { setFromHistory(null); handleSubmit(); }} className="gap-1.5 shrink-0 ml-3">
                  <RefreshCw className="h-3.5 w-3.5" /> Generate New Version
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!result && !loading && <EmptyState onSampleClick={handleSampleClick} />}

          {/* Results */}
          {result && (
            <div className="space-y-8">
              {result.blogMeta && <BlogPreview meta={result.blogMeta} url={activeUrl} />}




              <div className="flex justify-end">
                <ExportButton result={result} url={activeUrl} tone={tone} />
              </div>

              <OutputSection
                title="LinkedIn Posts"
                icon={<Linkedin className="h-5 w-5 text-primary" />}
                copyAllText={result.linkedinPosts.map((p) => `[${p.angle}]\n${p.content}`).join("\n\n---\n\n")}
              >
                {result.linkedinPosts.map((post, i) => (
                  <ContentCard key={i} label={post.angle} content={post.content} />
                ))}
              </OutputSection>

              <OutputSection
                title="Twitter Thread Hooks"
                icon={<Twitter className="h-5 w-5 text-primary" />}
                copyAllText={result.twitterHooks.map((h) => `[${h.type}]\n${h.content}`).join("\n\n---\n\n")}
              >
                {result.twitterHooks.map((hook, i) => (
                  <ContentCard key={i} label={hook.type} content={hook.content} charLimit={280} />
                ))}
              </OutputSection>

              <OutputSection title="Meta Description" icon={<Search className="h-5 w-5 text-primary" />}>
                <ContentCard label="SEO Optimized" content={result.metaDescription} charLimit={160} />
              </OutputSection>

              <OutputSection title="YouTube Video Content" icon={<Youtube className="h-5 w-5 text-primary" />}>
                <ContentCard label="Video Title" content={result.youtube.title} charLimit={60} />
                <ContentCard label="Video Description" content={result.youtube.description} />
              </OutputSection>

              {/* Email Newsletter */}
              {result.emailNewsletter && (
                <OutputSection title="Email Newsletter" icon={<Mail className="h-5 w-5 text-primary" />}>
                  <ContentCard label="Subject Line" content={result.emailNewsletter.subjectLine} charLimit={50} />
                  <ContentCard label="Preview Text" content={result.emailNewsletter.previewText} charLimit={90} />
                  <ContentCard label="Email Body" content={result.emailNewsletter.body} />
                </OutputSection>
              )}

              {/* Instagram Carousel */}
              {result.instagramCarousel && (
                <OutputSection
                  title="Instagram Carousel"
                  icon={<Instagram className="h-5 w-5 text-primary" />}
                  copyAllText={result.instagramCarousel.slides.map((s) => `[Slide ${s.slideNumber}]\n${s.text}`).join("\n\n---\n\n")}
                >
                  {result.instagramCarousel.slides.map((slide, i) => (
                    <ContentCard
                      key={i}
                      label={`Slide ${slide.slideNumber}${i === 0 ? " — Hook" : i === result.instagramCarousel.slides.length - 1 ? " — CTA" : ""}`}
                      content={slide.text}
                    />
                  ))}
                </OutputSection>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
