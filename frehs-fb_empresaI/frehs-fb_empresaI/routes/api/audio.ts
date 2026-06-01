import { Handlers } from "$fresh/server.ts";
import OpenAI from "jsr:@openai/openai";

const client = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export const handler: Handlers = {
  async POST(req) {
    const { text } = await req.json();

    const mp3 = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });

    const buffer = await mp3.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  },
};
