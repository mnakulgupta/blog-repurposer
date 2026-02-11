import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentCardProps {
  label: string;
  content: string;
  charLimit?: number;
}

function charColor(len: number, limit: number) {
  const ratio = len / limit;
  if (ratio > 1) return "text-destructive";
  if (ratio > 0.85) return "text-warning";
  return "text-success";
}

const ContentCard = ({ label, content, charLimit }: ContentCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {charLimit && (
            <span className={`text-xs font-medium ${charColor(content.length, charLimit)}`}>
              {content.length}/{charLimit}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs">
            {copied ? (
              <><Check className="h-3.5 w-3.5 text-success" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </Button>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{content}</p>
    </div>
  );
};

export default ContentCard;
