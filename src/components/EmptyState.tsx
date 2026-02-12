import { Link as LinkIcon, Sparkles, Linkedin, Twitter, Search, Youtube, Mail, Instagram, BarChart3 } from "lucide-react";

const SAMPLE_URLS = [
  "https://blog.hubspot.com/marketing/content-marketing-strategy",
  "https://neilpatel.com/blog/content-marketing/",
];

interface Props {
  onSampleClick: (url: string) => void;
}

const EmptyState = ({ onSampleClick }: Props) => (
  <div className="space-y-8 py-4">
    {/* How it works */}
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { step: "1", title: "Paste a URL or Text", desc: "Enter any blog post URL or paste content directly.", icon: LinkIcon },
        { step: "2", title: "AI Generates Assets", desc: "Our AI creates platform-specific content in seconds.", icon: Sparkles },
        { step: "3", title: "Copy & Publish", desc: "Copy individual pieces or export everything at once.", icon: Sparkles },
      ].map(({ step, title, desc, icon: Icon }) => (
        <div key={step} className="rounded-xl border border-border bg-card p-5 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
            {step}
          </div>
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>

    {/* What you get */}
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">What you'll get:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Linkedin, label: "LinkedIn Posts" },
          { icon: Twitter, label: "Twitter Hooks" },
          { icon: Search, label: "Meta Description" },
          { icon: Youtube, label: "YouTube Script" },
          { icon: Mail, label: "Email Newsletter" },
          { icon: Instagram, label: "IG Carousel" },
          { icon: BarChart3, label: "Content Score" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
            <Icon className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Sample URLs */}
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">Try a sample URL:</h3>
      <div className="space-y-2">
        {SAMPLE_URLS.map((url) => (
          <button
            key={url}
            onClick={() => onSampleClick(url)}
            className="w-full text-left rounded-lg border border-dashed border-border px-4 py-2.5 text-xs text-primary hover:bg-primary/5 transition-colors truncate"
          >
            {url}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default EmptyState;
