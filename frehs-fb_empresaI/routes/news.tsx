import { Handlers, PageProps } from "$fresh/server.ts";
import ArticulosCollection from "../db/client.ts";
import { Article } from "../types.ts";

export type Data = {
  articles: Article[];
};

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const articlesDB = await ArticulosCollection.find().sort({ date: -1 })
      .toArray();

    const articles: Article[] = articlesDB.map((article) => ({
      id: article._id.toString(),
      title: article.title,
      url: article.url,
      summary: article.summary,
      date: article.date,
      category: article.category,
    }));

    return ctx.render({ articles });
  },
};

export default function Page(props: PageProps<Data>) {
  const { articles } = props.data;

  return (
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">Últimas Noticias</h2>
        <p class="page-subtitle">
          Resúmenes generados automáticamente por Football Bot AI
        </p>
      </div>

      {articles.length === 0
        ? (
          <div class="no-news-container">
            <p class="no-news-title">No hay noticias</p>
            <p class="no-news-text">
              Ejecuta el bot para buscar las noticias del día.
            </p>
          </div>
        )
        : (
          <div class="news-grid">
            {articles.map((article) => (
              <div key={article.id} class="news-card">
                {
                  /*{article.imageUrl && <img src={article.imageUrl} class="card-image" alt="noticia" />}
              */
                }

                <div class="card-content">
                  <div class="card-meta">
                    <span class="card-date">
                      {new Date(article.date).toLocaleDateString("es-ES")}
                    </span>
                    <span class="category-tag">
                      {article.category || "General"}
                    </span>
                  </div>

                  <h3 class="card-title">{article.title}</h3>

                  <div class="ai-summary-box">
                    <span class="ai-label">Análisis IA</span>
                    <p class="ai-text">"{article.summary}"</p>
                  </div>

                  <a href={`/news/${article.id}`} class="read-more-btn">
                    Ir a la noticia completa →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
