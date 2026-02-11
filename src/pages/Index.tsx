import { useState } from "react";
import { Loader2, Link as LinkIcon, Linkedin, Twitter, Search, Youtube, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ContentCard from "@/components/ContentCard";
import OutputSection from "@/components/OutputSection";
import { useAuth } from "@/hooks/useAuth";
import type { RepurposedContent } from "@/types/repurpose";

const Index = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RepurposedContent | null>(null);
  const { signOut } = useAuth();

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Please enter a blog URL");
      return;
    }
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid blog URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("repurpose-content", {
        body: { url },
      });

      if (error) {
        toast.error(error.message || "Something went wrong. Please try again.");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult(data as RepurposedContent);
      toast.success("Content generated successfully!");
    } catch {
      toast.error("Unable to connect. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                AI Blog Content Repurposer
              </h1>
            </div>
            <p className="text-muted-foreground">
              Turn one blog post into multiple content assets
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-10">
        {/* URL Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your blog post URL here..."
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
              disabled={loading}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Content"
            )}
          </Button>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Extracting content and generating repurposed assets...</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-10">
            <OutputSection title="LinkedIn Posts" icon={<Linkedin className="h-5 w-5 text-primary" />}>
              {result.linkedinPosts.map((post, i) => (
                <ContentCard key={i} label={post.angle} content={post.content} />
              ))}
            </OutputSection>

            <OutputSection title="Twitter Thread Hooks" icon={<Twitter className="h-5 w-5 text-primary" />}>
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
