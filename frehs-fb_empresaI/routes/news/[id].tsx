import { Handlers, PageProps } from "$fresh/server.ts";
import { ObjectId } from "npm:mongodb";
import ArticulosCollection from "../../db/client.ts";
import { Article } from "../../types.ts";

export const handler: Handlers<Article> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;

    try {
      const articleDB = await ArticulosCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!articleDB) {
        return ctx.renderNotFound();
      }

      const article: Article = {
        id: articleDB._id.toString(),
        title: articleDB.title,
        url: articleDB.url,
        summary: articleDB.summary,
        date: articleDB.date,
        category: articleDB.category,
      };

      return ctx.render(article);
    } catch (e) {
      console.error("Error buscando noticia:", e);
      return ctx.renderNotFound();
    }
  },
};

export default function SingleNewsPage(props: PageProps<Article>) {
  const article = props.data;

  return (
    <div class="page-container">
      <div class="single-article-card">
        <div class="card-meta">
          <span class="card-date">
            {new Date(article.date).toLocaleDateString()}
          </span>
          <span class="category-tag">{article.category}</span>
        </div>

        <h1 class="page-title" style={{ marginTop: "1rem" }}>
          {article.title}
        </h1>

        <div class="ai-summary-box" style={{ marginTop: "2rem" }}>
          <span class="ai-label">Análisis IA</span>
          <p class="ai-text" style={{ fontSize: "1.1rem" }}>
            "{article.summary}"
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <a
            href="/news"
            class="read-more-btn"
            style={{ backgroundColor: "#333" }}
          >
            ← Volver a la lista
          </a>

          <a href={article.url} target="_blank" class="read-more-btn">
            Leer fuente original 
          </a>
        </div>
      </div>
    </div>
  );
}
