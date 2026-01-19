import "jsr:@std/dotenv/load";

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
//con gemini
export async function generateSmartSummary(
  title: string,
  description: string,
): Promise<string> {
  // 1. Si no hay descripción, no hacemos nada
  if (!description) return "";

  // 2. Definimos la función de "Resumen Local" (Plan C)
  // Si la IA falla, cortamos el texto en el primer punto (.) después de los 100 caracteres
  // para que no quede cortado a mitad de frase.
  const createLocalSummary = (text: string) => {
    if (text.length < 120) return text;
    const cutPoint = text.indexOf(".", 100);
    if (cutPoint !== -1) return text.substring(0, cutPoint + 1);
    return text.substring(0, 120) + "...";
  };

  if (!GEMINI_KEY) return createLocalSummary(description);

  const prompt = `
    Resumen de noticia de fútbol (LaLiga).
    Texto: ${title} - ${description}
    Salida: Máximo 20 palabras. Emocionante. Sin intro.
  `;

  // 3. LISTA LIMPIA (Quitamos el 8b que da error 404)
  const MODELS = [
    "gemini-flash-latest", // El más rápido
    "gemini-2.0-flash-exp", // El experimental (Suele tener cupo aparte)
    "gemini-pro-latest", // El potente (Último recurso)
  ];

  for (const modelName of MODELS) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`;

    try {
      // ⚠️ TRUCO: Añadimos un pequeño retardo aleatorio (300ms - 1000ms)
      // Esto ayuda a que no lleguen todas las peticiones en el mismo milisegundo
      await new Promise((r) => setTimeout(r, Math.random() * 1000 + 300));

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }

      // Si es error de Límite (429), seguimos al siguiente modelo
      if (response.status === 429 || response.status === 503) {
        continue;
      }
    } catch (e) {
      // Ignoramos errores de red y probamos el siguiente
    }
  }

  // 4. SI TODO FALLA: Usamos el resumen local en vez del texto gigante
  console.warn("⚠️ IA agotada. Usando recorte local.");
  return createLocalSummary(description);
}
