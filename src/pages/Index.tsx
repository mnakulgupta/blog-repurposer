import { useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Search, Youtube, Sparkles, AlertCircle, RefreshCw, Link as LinkIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ContentCard from "@/components/ContentCard";
import OutputSection from "@/components/OutputSection";
import BlogPreview from "@/components/BlogPreview";
import ToneSelector from "@/components/ToneSelector";
import ExportButton from "@/components/ExportButton";
import LoadingSteps from "@/components/LoadingSteps";
import GenerationHistory, { saveToHistory } from "@/components/GenerationHistory";
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

  const isValidUrl = (str: string) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const handleSubmit = async () => {
    setError(null);
    setFromHistory(null);
    if (!url.trim()) { setError("Please enter a blog URL"); return; }
    if (!isValidUrl(url)) { setError("Invalid URL format. Please enter a complete URL starting with http:// or https://"); return; }

    setLoading(true);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("repurpose-content", {
        body: { url, tone },
      });

      if (fnError) { setError(fnError.message || "Something went wrong. Please try again."); return; }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8 flex items-center justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                AI Blog Content Repurposer
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Turn one blog post into multiple content assets
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastGenerated && (
              <span className="hidden sm:block text-xs text-muted-foreground">
                Last: {lastGenerated}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8 space-y-6">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <ToneSelector value={tone} onChange={setTone} disabled={loading} />
        </div>

        {/* History */}
        <GenerationHistory onSelect={handleHistorySelect} />

        {/* URL Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); }}
              placeholder="Paste your blog post URL here..."
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
              disabled={loading}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2 min-w-[140px]">
            Generate Content
          </Button>
        </div>

        {/* Error display */}
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
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
