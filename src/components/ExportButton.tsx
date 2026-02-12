import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RepurposedContent, ToneOption } from "@/types/repurpose";
import { TONE_LABELS } from "@/types/repurpose";

interface ExportButtonProps {
  result: RepurposedContent;
  url: string;
  tone: ToneOption;
}

const ExportButton = ({ result, url, tone }: ExportButtonProps) => {
  const handleExport = () => {
    const now = new Date();
    const ts = now.toLocaleString();
    const filename = `blog-repurposer-${now.toISOString().slice(0, 16).replace(/[T:]/g, "-")}.md`;

    const lines = [
      "# Blog Content Repurpose",
      `Generated on: ${ts}`,
      `Original URL: ${url}`,
      "",
      "## Blog Details",
      `- Title: ${result.blogMeta?.title ?? "N/A"}`,
      `- Word Count: ${result.blogMeta?.wordCount ?? "N/A"}`,
      `- Generated Tone: ${TONE_LABELS[tone]}`,
      "",
      "---",
      "",
      "## LinkedIn Posts",
      "",
      ...result.linkedinPosts.flatMap((p) => [`### ${p.angle}`, "", p.content, ""]),
      "---",
      "",
      "## Twitter Thread Hooks",
      "",
      ...result.twitterHooks.flatMap((h) => [`### ${h.type}`, "", h.content, ""]),
      "---",
      "",
      "## Meta Description",
      "", result.metaDescription, "",
      "---",
      "",
      "## YouTube Video Content",
      "",
      `### Title`, "", result.youtube.title, "",
      `### Description`, "", result.youtube.description, "",
    ];

    if (result.emailNewsletter) {
      lines.push(
        "---", "",
        "## Email Newsletter", "",
        `### Subject Line`, "", result.emailNewsletter.subjectLine, "",
        `### Preview Text`, "", result.emailNewsletter.previewText, "",
        `### Body`, "", result.emailNewsletter.body, "",
      );
    }

    if (result.instagramCarousel) {
      lines.push(
        "---", "",
        "## Instagram Carousel", "",
        ...result.instagramCarousel.slides.flatMap((s) => [`### Slide ${s.slideNumber}`, "", s.text, ""]),
      );
    }

    if (result.contentScore) {
      lines.push(
        "---", "",
        "## Content Score", "",
        `- Readability: ${result.contentScore.readability}/100`,
        `- Engagement: ${result.contentScore.engagement}/100`,
        `- SEO Strength: ${result.contentScore.seoStrength}/100`,
        `- Keyword Density: ${result.contentScore.keywordDensity}`,
        `- Summary: ${result.contentScore.summary}`,
      );
    }

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" /> Export All as Markdown
    </Button>
  );
};

export default ExportButton;
