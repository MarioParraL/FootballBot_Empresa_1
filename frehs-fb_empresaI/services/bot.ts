import { getLaLigaNews } from "./news.ts";
import { generateSmartSummary } from "./openai.ts";
import ArticulosCollection from "../db/client.ts";
import { ArticleDB } from "../types.ts";

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function runBotUpdate() {
  console.log("INICIANDO ACTUALIZACIÓN");

  const rawNews = await getLaLigaNews();
  let count = 0;

  for (const news of rawNews) {
    const exists = await ArticulosCollection.findOne({ url: news.url });
    if (exists) continue;

    console.log(`Resumiendo noticia: ${news.title.substring(0, 50)}...`);

    const summary = await generateSmartSummary(
      news.title,
      news.description,
    );

    const article: ArticleDB = {
      title: news.title,
      url: news.url,
      summary,
      date: news.publishedAt,
      category: "LaLiga",
    };

    await ArticulosCollection.insertOne(article);
    count++;
    await sleep(3500);
  }

  console.log(`Se han guardado ${count} noticias nuevas de LaLiga.`);
}
