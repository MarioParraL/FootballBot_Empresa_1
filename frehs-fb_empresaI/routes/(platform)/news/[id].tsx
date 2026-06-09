import { Handlers, PageProps } from "$fresh/server.ts";
import { ObjectId } from "npm:mongodb";
import ArticulosCollection from "../../../db/client.ts";
import { Article } from "../../../types.ts";
import AudioPlayer from "../../../islands/AudioPlayer.tsx";

export const handler: Handlers<Article | null> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;

    // ✅ 1. Validación de ID (evita que rompa ObjectId)
    if (!ObjectId.isValid(id)) {
      console.warn("ID inválido:", id);
      return ctx.renderNotFound();
    }

    try {
      // ✅ 2. Buscar en Mongo correctamente
      const articleDB = await ArticulosCollection.findOne({
        _id: new ObjectId(id),
      });

      // ✅ 3. Control de no encontrado
      if (!articleDB) {
        return ctx.renderNotFound();
      }

      // ✅ 4. Mapear correctamente
      const article: Article = {
        id: articleDB._id.toString(),
        title: articleDB.title,
        url: articleDB.url,
        summary: articleDB.summary,
        date: articleDB.date,
        category: articleDB.category || "General",
      };

      return ctx.render(article);
    } catch (e) {
      console.error("Error buscando noticia:", e);
      return ctx.renderNotFound();
    }
  },
};

export default function SingleNewsPage(props: PageProps<Article | null>) {
  const article = props.data;

  // ✅ 5. Seguridad extra (por si acaso)
  if (!article) {
    return <div>No se ha podido cargar la noticia.</div>;
  }

  return (
    <div class="page-container">
      <div class="single-article-card">

        <div class="card-meta">
          <span class="card-date">
            {new Date(article.date).toLocaleDateString("es-ES")}
          </span>

          <span class="category-tag">
            {article.category || "General"}
          </span>
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

        <div style={{ marginTop: "1.5rem" }}>
          <AudioPlayer summary={article.summary} />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <a
            href="/news"
            class="read-more-btn"
            style={{ backgroundColor: "#333" }}
          >
            ← Volver a la lista
          </a>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            class="read-more-btn"
          >
            Leer fuente original →
          </a>
        </div>

      </div>
    </div>
  );
}
