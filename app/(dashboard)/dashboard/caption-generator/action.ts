"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function generateCaption(
  _prevState: {
    error?: string;
    captions?: { caption: string; platform: string }[];
  },
  formData: FormData
) {
  console.log(formData.get("image"));
  console.log(formData.get("tone"));
  
  const file = formData.get("image") as File;
  const tone = formData.get("tone") as string;

  if (!file || file.size === 0) {
    return { error: "No file uploaded." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = `
You are a social media expert who generates captions for images.

Generate exactly 5 captions for the provided image, one for each platform: Instagram, Twitter, LinkedIn, TikTok, and Youtube.

Each caption should be:
- Optimized for the specific platform's audience and format
- Based on the visual content, objects, text, scene, and entities in the image
- Written in the requested tone and style
- Engaging and relevant to the image content

Return the captions in the exact JSON format requested, with an array of caption objects.
  `;

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        captions: z.array(
          z.object({
            caption: z.string(),
            platform: z.string(),
          })
        ),
      }),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Tone and style preferences: ${tone}

Please analyze this image and generate 5 social media captions (one for each platform: Instagram, Twitter, LinkedIn, TikTok, Youtube) that match the specified tone. Return the data as a JSON object with a "captions" array containing objects with "caption" and "platform" fields.`,
            },
            {
              type: "image",
              image: dataUrl,
            },
          ],
        },
      ],
    });

    console.log(object.captions);
    return { captions: object.captions };
  } catch (error) {
    console.error(error);
    return { error: "Error generating caption." };
  }
}
