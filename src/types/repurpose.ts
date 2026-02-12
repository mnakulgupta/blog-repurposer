export interface BlogMeta {
  title: string;
  author: string;
  date: string;
  image: string;
  wordCount: number;
  readingTime: number;
  previewText: string;
}

export interface ContentScore {
  readability: number;
  engagement: number;
  seoStrength: number;
  keywordDensity: string;
  summary: string;
}

export interface RepurposedContent {
  linkedinPosts: { angle: string; content: string }[];
  twitterHooks: { type: string; content: string }[];
  metaDescription: string;
  youtube: { title: string; description: string };
  emailNewsletter: { subjectLine: string; previewText: string; body: string };
  instagramCarousel: { slides: { slideNumber: number; text: string }[] };
  contentScore: ContentScore;
  blogMeta: BlogMeta;
}

export type ToneOption = "b2b-formal" | "b2b-casual" | "b2c-formal" | "b2c-casual";

export const TONE_LABELS: Record<ToneOption, string> = {
  "b2b-formal": "B2B – Formal",
  "b2b-casual": "B2B – Casual",
  "b2c-formal": "B2C – Formal",
  "b2c-casual": "B2C – Casual",
};

export interface HistoryEntry {
  url: string;
  timestamp: number;
  tone: ToneOption;
  previewTitle: string;
  result: RepurposedContent;
}
