import { BarChart3, TrendingUp, Search, BookOpen } from "lucide-react";
import type { ContentScore } from "@/types/repurpose";

function scoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

function ScoreRing({ value, label, icon: Icon }: { value: number; label: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            className={scoreColor(value)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${scoreColor(value)}`}>{value}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
    </div>
  );
}

interface Props {
  score: ContentScore;
}

const ContentScoreCard = ({ score }: Props) => (
  <div className="rounded-lg border border-border bg-card p-5 space-y-4">
    <div className="flex items-center gap-2">
      <BarChart3 className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-bold text-foreground">Content Analysis</h2>
    </div>
    <div className="flex justify-around">
      <ScoreRing value={score.readability} label="Readability" icon={BookOpen} />
      <ScoreRing value={score.engagement} label="Engagement" icon={TrendingUp} />
      <ScoreRing value={score.seoStrength} label="SEO" icon={Search} />
    </div>
    <div className="space-y-2 pt-2 border-t border-border">
      <p className="text-xs text-muted-foreground">
        <strong className="text-foreground">Keyword Density:</strong> {score.keywordDensity}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">{score.summary}</p>
    </div>
  </div>
);

export default ContentScoreCard;
