import { ExternalLink, FileText, Clock, BarChart3, User, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BlogMeta } from "@/types/repurpose";

interface BlogPreviewProps {
  meta: BlogMeta;
  url: string;
}

const BlogPreview = ({ meta, url }: BlogPreviewProps) => (
  <section className="rounded-lg border border-border bg-card overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/50">
      <FileText className="h-5 w-5 text-primary" />
      <h2 className="text-base font-bold text-foreground">Blog Preview</h2>
    </div>

    {meta.image && (
      <img
        src={meta.image}
        alt={meta.title}
        className="w-full max-h-56 object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    )}

    <div className="p-5 space-y-4">
      <h3 className="text-xl font-extrabold leading-tight text-foreground">{meta.title}</h3>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {meta.author && (
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> {meta.author}
          </span>
        )}
        {meta.date && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> {meta.date}
          </span>
        )}
        <Badge variant="secondary" className="gap-1 text-xs font-medium">
          <BarChart3 className="h-3 w-3" /> ~{meta.wordCount.toLocaleString()} words
        </Badge>
        <Badge variant="secondary" className="gap-1 text-xs font-medium">
          <Clock className="h-3 w-3" /> {meta.readingTime} min read
        </Badge>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-6">{meta.previewText}</p>

      <Button variant="outline" size="sm" asChild>
        <a href={url} target="_blank" rel="noopener noreferrer" className="gap-1.5">
          View Original Article <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  </section>
);

export default BlogPreview;
