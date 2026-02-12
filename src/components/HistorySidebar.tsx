import { useState } from "react";
import { History, Trash2, Clock, PanelLeftClose, PanelLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TONE_LABELS, type HistoryEntry, type RepurposedContent } from "@/types/repurpose";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "repurpose-history";

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function saveToHistory(entry: HistoryEntry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
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
  onNewGeneration: () => void;
  activeUrl: string;
}

const HistorySidebar = ({ onSelect, onNewGeneration, activeUrl }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState(loadHistory);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 border-r border-border bg-card flex flex-col transition-all duration-300 shrink-0",
        collapsed ? "w-14" : "w-72"
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center border-b border-border p-3", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-primary" /> History
            {items.length > 0 && <Badge variant="secondary" className="text-[10px] h-5">{items.length}</Badge>}
          </span>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* New Generation Button */}
      <div className={cn("p-2", collapsed && "flex justify-center")}>
        <Button
          variant="outline"
          size={collapsed ? "icon" : "sm"}
          className={cn(!collapsed && "w-full gap-2")}
          onClick={onNewGeneration}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && "New Generation"}
        </Button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {collapsed ? (
          items.slice(0, 8).map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item.result, item.url)}
              className={cn(
                "w-full flex justify-center p-2 rounded-md hover:bg-muted/50 transition-colors",
                activeUrl === item.url && "bg-primary/10"
              )}
              title={item.previewTitle}
            >
              <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                {(item.previewTitle || "?")[0].toUpperCase()}
              </div>
            </button>
          ))
        ) : (
          items.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item.result, item.url)}
              className={cn(
                "w-full text-left rounded-lg p-3 hover:bg-muted/50 transition-colors space-y-1",
                activeUrl === item.url && "bg-primary/10 border border-primary/20"
              )}
            >
              <p className="text-sm font-medium text-foreground truncate">{item.previewTitle}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(item.timestamp)}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{TONE_LABELS[item.tone]}</span>
              </div>
            </button>
          ))
        )}
        {items.length === 0 && !collapsed && (
          <div className="text-center py-8 px-3">
            <History className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No history yet. Generate your first content!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && !collapsed && (
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-1.5 text-destructive hover:text-destructive text-xs"
            onClick={() => { clearHistory(); setItems([]); }}
          >
            <Trash2 className="h-3 w-3" /> Clear All
          </Button>
        </div>
      )}
    </aside>
  );
};

export default HistorySidebar;
