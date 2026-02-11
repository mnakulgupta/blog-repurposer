import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TONE_LABELS, type ToneOption } from "@/types/repurpose";

interface ToneSelectorProps {
  value: ToneOption;
  onChange: (v: ToneOption) => void;
  disabled?: boolean;
}

const ToneSelector = ({ value, onChange, disabled }: ToneSelectorProps) => (
  <div className="flex items-center gap-3">
    <label className="text-sm font-medium text-foreground whitespace-nowrap">
      Content Tone & Audience:
    </label>
    <Select value={value} onValueChange={(v) => onChange(v as ToneOption)} disabled={disabled}>
      <SelectTrigger className="w-48 bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover z-50">
        {(Object.entries(TONE_LABELS) as [ToneOption, string][]).map(([key, label]) => (
          <SelectItem key={key} value={key}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default ToneSelector;
