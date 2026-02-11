import { ReactNode, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OutputSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  copyAllText?: string;
}

const OutputSection = ({ title, icon, children, copyAllText }: OutputSectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (!copyAllText) return;
    await navigator.clipboard.writeText(copyAllText);
    setCopied(true);
    toast.success(`All ${title.toLowerCase()} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        {copyAllText && (
          <Button variant="ghost" size="sm" onClick={handleCopyAll} className="gap-1.5 text-xs h-8">
            {copied ? <><Check className="h-3.5 w-3.5 text-success" /> Copied All</> : <><Copy className="h-3.5 w-3.5" /> Copy All</>}
          </Button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
};

export default OutputSection;
