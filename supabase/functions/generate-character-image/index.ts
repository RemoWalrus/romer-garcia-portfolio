import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating image with prompt:", prompt);
    console.log("Image URL provided:", imageUrl ? "Yes" : "No");

    // Add watermark and 4:5 aspect ratio instruction to the prompt
    const enhancedPrompt = `${prompt} 

ABSOLUTE REQUIREMENTS:
1. ASPECT RATIO: Must be exactly 4:5 portrait orientation (800x1000 pixels, 1200x1500 pixels, or any 4:5 ratio). The image MUST be vertical/portrait, NOT square or horizontal.
2. WATERMARK: In the bottom right corner, add very small glowing neon cyan/blue katakana text "パラドクシア" (approximately 10-12pt font size). The text should have a subtle cyan glow effect, be clearly legible but unobtrusive, positioned 15-20 pixels from the bottom and right edges. Keep the watermark consistently small across all images.

These requirements are NON-NEGOTIABLE. The image must be 4:5 portrait ratio.`;

    // Build the content array based on whether we're editing or generating
    const content = imageUrl 
      ? [
          { type: "text", text: enhancedPrompt },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      : enhancedPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: content
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");
    
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      throw new Error("No image URL in response");
    }

    return new Response(JSON.stringify({ imageUrl: generatedImageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-character-image function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
