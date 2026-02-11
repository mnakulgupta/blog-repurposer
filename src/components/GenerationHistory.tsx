import { useState } from "react";
import { History, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TONE_LABELS, type HistoryEntry, type RepurposedContent } from "@/types/repurpose";

const STORAGE_KEY = "repurpose-history";

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function saveToHistory(entry: HistoryEntry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 10)));
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface Props {
  onSelect: (result: RepurposedContent, url: string) => void;
}

const GenerationHistory = ({ onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(loadHistory);

  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors rounded-lg"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="h-4 w-4 text-primary" /> Recent Generations
          <Badge variant="secondary" className="text-xs">{items.length}</Badge>
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3 space-y-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item.result, item.url)}
              className="w-full text-left rounded-md p-3 hover:bg-muted/50 transition-colors space-y-1"
            >
              <p className="text-sm font-medium text-foreground truncate">{item.previewTitle}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(item.timestamp)}</span>
                <span>{TONE_LABELS[item.tone]}</span>
              </div>
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-1.5 text-destructive hover:text-destructive"
            onClick={() => { clearHistory(); setItems([]); }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear History
          </Button>
          <p className="text-[11px] text-muted-foreground text-center pt-1">
            History is stored locally in your browser. Clear your browser data to remove.
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerationHistory;
