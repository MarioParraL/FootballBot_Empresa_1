import "jsr:@std/dotenv/load";

const API_KEY = Deno.env.get("NEWS_API_KEY");

export type Article = {
  title: string;
  url: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
}; 

export async function getLaLigaNews(): Promise<Article[]> {
  if (!API_KEY) {
    console.error("NEWS_API_KEY ERROR");
    return [];
  }
  const fromDate = new Date(Date.now() - 1000 * 60 * 60 * 36)
    .toISOString()
    .split("T")[0];

  const query = encodeURIComponent(
    '(LaLiga OR Madrid OR Barcelona OR Atleti) AND (crónica OR resumen OR goles OR "vs")',
  );

  const url =
    `https://newsapi.org/v2/everything?q=${query}&domains=marca.com,as.com,mundodeportivo.com,sport.es&language=es&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}&from=${fromDate}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") return [];

    const noticias = data.articles.filter((art: any) =>
      art.title &&
      art.title !== "[Removed]" &&
      art.description &&
      art.description.length > 20
    );

    /*noticias.sort((a: any, b: any) => {
      const aOk = /\d+-\d+/.test(a.title) || a.title.includes("Crónica");
      const bOk = /\d+-\d+/.test(b.title) || b.title.includes("Crónica");
      if (aOk && !bOk) return -1;
      if (!aOk && bOk) return 1;
      return 0;
    });*/

    return noticias.slice(0, 10);
  } catch (e) {
    console.error("Error buscando noticias:", e);
    return [];
  }
}
