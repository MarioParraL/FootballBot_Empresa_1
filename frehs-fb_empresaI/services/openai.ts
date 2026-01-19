import "jsr:@std/dotenv/load";

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function generateSmartSummary(
  title: string,
  description: string,
): Promise<string> {
  if (!OPENAI_KEY) return description;

  const prompt = `
Eres un periodista deportivo y narrador enérgico experto de fútbol.
Reescribe la siguiente noticia en español.
Resumen corto, emocionante y nuevo. 
Destaca goles y datos estaísticos (solo información útil).
Máximo 25 palabras.
${title}
${description}
`;

  for (let intento = 1; intento <= 2; intento++) {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Eres un periodista deportivo español.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.8,
            max_tokens: 60,
          }),
        },
      );

      if (response.status === 429) {
        console.warn(
          `Rate limit OpenAI (intento ${intento}).`,
        );
        await sleep(4000);
        continue;
      }

      if (!response.ok) {
        console.error("Error OpenAI:", response.status);
        return description;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.error("Error conexión OpenAI");
    }
  }

  console.warn("OpenAI no respondió: Usando descripción original.");
  return description;
}
