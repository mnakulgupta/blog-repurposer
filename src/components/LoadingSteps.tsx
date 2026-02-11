import { useEffect, useState } from "react";
import { Search, Brain, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  { label: "Extracting blog content...", icon: Search, durationMs: 3000 },
  { label: "Analyzing content...", icon: Brain, durationMs: 2000 },
  { label: "Generating repurposed content...", icon: Sparkles, durationMs: 10000 },
  { label: "Ready!", icon: CheckCircle2, durationMs: 0 },
];

const LoadingSteps = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    STEPS.forEach((step, i) => {
      if (i === 0) return;
      elapsed += STEPS[i - 1].durationMs;
      timers.push(setTimeout(() => setActiveStep(i), elapsed));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const progress = Math.min(((activeStep + 1) / STEPS.length) * 100, 95);

  return (
    <div className="space-y-4 py-8">
      <Progress value={progress} className="h-2" />
      <div className="space-y-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 text-sm transition-opacity ${
                done ? "text-success opacity-80" : active ? "text-foreground font-medium" : "text-muted-foreground/40"
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : active ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingSteps;
