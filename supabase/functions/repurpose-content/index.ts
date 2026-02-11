import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Request from user:", userId);

    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Extract content via Jina Reader
    console.log("Extracting content from:", url);
    const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/markdown" },
    });

    if (!jinaResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Couldn't extract content from this URL. Try a different blog post." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const blogContent = await jinaResponse.text();
    if (!blogContent || blogContent.length < 100) {
      return new Response(
        JSON.stringify({ error: "Extracted content is too short. Try a different blog post." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Generate repurposed content via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert content repurposer for social media and SEO. You write in a natural, human voice — not corporate AI speak. You avoid phrases like "revolutionize", "game-changer", "unlock", "in today's landscape", "In today's rapidly evolving landscape", or "Unlock the power of".`;

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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(aiData));
      return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const content = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("repurpose error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
