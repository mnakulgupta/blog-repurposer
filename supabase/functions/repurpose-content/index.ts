import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function extractMetadata(markdown: string, url: string) {
  const lines = markdown.split("\n");
  let title = "";
  let author = "";
  let date = "";
  let image = "";

  for (const line of lines.slice(0, 30)) {
    if (!title && /^#\s+/.test(line)) {
      title = line.replace(/^#+\s*/, "").trim();
    }
    if (!author && /author|by\s/i.test(line)) {
      const match = line.match(/(?:by|author[:\s]*)\s*([A-Z][a-z]+ [A-Z][a-z]+)/i);
      if (match) author = match[1];
    }
    if (!date) {
      const dateMatch = line.match(/(\w+ \d{1,2},?\s*\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/);
      if (dateMatch) date = dateMatch[1];
    }
    if (!image) {
      const imgMatch = line.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
      if (imgMatch) image = imgMatch[1];
    }
  }

  if (!title) {
    try {
      const urlObj = new URL(url);
      const slug = urlObj.pathname.split("/").filter(Boolean).pop() || "";
      title = slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    } catch { title = "Untitled Blog Post"; }
  }

  const words = markdown.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 250));
  const plainText = markdown.replace(/[#*\[\]()!`>|_~-]/g, " ").replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();
  const previewText = plainText.substring(0, 1200).replace(/\s\S*$/, "");

  return { title, author, date, image, wordCount, readingTime, previewText };
}

function getToneInstruction(tone: string): string {
  switch (tone) {
    case "b2b-casual": return "Write in a B2B tone but keep it conversational and approachable. Use contractions, direct address, and a friendly expert voice.";
    case "b2c-formal": return "Write for consumers in a polished, professional tone. Be informative and authoritative while remaining accessible.";
    case "b2c-casual": return "Write in a fun, engaging consumer-friendly tone. Be relatable, use everyday language, and connect emotionally.";
    default: return "Write in a professional B2B tone. Be authoritative, data-driven, and insightful. Avoid fluff.";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {

    const { url, tone = "b2b-formal", manualText } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: "Valid URL is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate URL format, scheme, length, and block private IPs
    if (url.length > 2048) {
      return new Response(JSON.stringify({ error: "URL exceeds maximum length" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let parsedUrl: URL;
    try { parsedUrl = new URL(url); } catch {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return new Response(JSON.stringify({ error: "Only HTTP/HTTPS URLs are allowed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const hostname = parsedUrl.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return new Response(JSON.stringify({ error: "Private or internal URLs are not allowed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Extract content (skip if manualText provided)
    let blogContent: string;

    if (manualText && typeof manualText === "string" && manualText.trim().length >= 200) {
      console.log("Using manual text input, skipping Jina extraction");
      blogContent = manualText.trim();
    } else if (manualText) {
      return new Response(
        JSON.stringify({ error: "Manual text must be at least 200 characters.", errorType: "validation_failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log("Extracting content from:", url);
      const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
        headers: { Accept: "text/markdown" },
      });

      if (!jinaResponse.ok) {
        return new Response(
          JSON.stringify({ error: "EXTRACTION_FAILED", message: "We couldn't read that URL automatically. The site might be blocking bots.", errorType: "extraction_failed" }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const rawContent = await jinaResponse.text();
      if (!rawContent || rawContent.trim().length < 200) {
        return new Response(
          JSON.stringify({ error: "EXTRACTION_FAILED", message: "We couldn't read that URL automatically. The site might be blocking bots.", errorType: "extraction_failed" }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      blogContent = rawContent;
    }

    const blogMeta = extractMetadata(blogContent, url);

    // Step 2: Generate repurposed content
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const toneInstruction = getToneInstruction(tone);

    const systemPrompt = `You are an expert content repurposer for social media and SEO. You write in a natural, human voice — not corporate AI speak. You avoid phrases like "revolutionize", "game-changer", "unlock", "in today's landscape", "In today's rapidly evolving landscape", or "Unlock the power of". ${toneInstruction}`;

    const userPrompt = `I will provide you with a blog post content. Generate repurposed content assets.

Blog Content:
---
${blogContent.substring(0, 8000)}
---

Generate the following. Use tool calling to return structured output.

REQUIREMENTS:
- LinkedIn posts: 150-250 words each, natural human voice, NO corporate jargon, each genuinely different angle. Use line breaks for readability.
- Twitter hooks: Under 280 characters, create curiosity, make people want to read the thread
- Meta description: Under 160 characters, SEO-optimized, action-oriented
- YouTube title: Under 60 characters, engaging but not clickbait
- YouTube description: 3-4 sentences, video-focused language
- Write like a human marketer, not like ChatGPT`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_repurposed_content",
              description: "Return the repurposed content assets",
              parameters: {
                type: "object",
                properties: {
                  linkedinPosts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        angle: { type: "string", enum: ["Educational", "Controversial Take", "Personal Story"] },
                        content: { type: "string" },
                      },
                      required: ["angle", "content"],
                      additionalProperties: false,
                    },
                  },
                  twitterHooks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["Question-based", "Bold Statement", "Story Hook"] },
                        content: { type: "string" },
                      },
                      required: ["type", "content"],
                      additionalProperties: false,
                    },
                  },
                  metaDescription: { type: "string" },
                  youtube: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["title", "description"],
                    additionalProperties: false,
                  },
                },
                required: ["linkedinPosts", "twitterHooks", "metaDescription", "youtube"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_repurposed_content" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment before trying again.", errorType: "rate_limit" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds.", errorType: "credits" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI generation failed. Please try again in a moment.", errorType: "ai_failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(aiData));
      return new Response(JSON.stringify({ error: "AI generation failed. Please try again.", errorType: "ai_failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const content = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ ...content, blogMeta }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("repurpose error:", e);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request. Please try again.", errorType: "server_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
