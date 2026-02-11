import { ReactNode } from "react";

interface OutputSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const OutputSection = ({ title, icon, children }: OutputSectionProps) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
};

export default OutputSection;
