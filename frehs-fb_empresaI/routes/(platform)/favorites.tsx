import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import ArticulosCollection from "../../db/client.ts";
import getUsersCollection from "../../db/User.ts";
import AudioPlayer from "../../islands/AudioPlayer.tsx";
import TodasAudioPlayer from "../../islands/TodasAudioPlayer.tsx";
import { Article } from "../../types.ts";

const EQUIPOS_KEYWORDS: Record<string, string[]> = {
  "Real Madrid": [
    "Real Madrid",
    "Madrid",
    "RM",
    "Madrid FC",
    "Merengue",
    "Merengues",
  ],
  "FC Barcelona": [
    "FC Barcelona",
    "Barcelona",
    "Barsa",
    "Barça",
    "Barca",
    "Culé",
    "Culés",
    "Blaugrana",
  ],
  "Atlético de Madrid": [
    "Atlético de Madrid",
    "Atleti",
    "Atletico",
    "Atlético",
    "Colchonero",
    "Colchoneros",
    "Indios",
  ],
  "RC Deportivo de la Coruña": [
    "Deportivo",
    "Depor",
    "Coruña",
    "Deportivistas",
    "Riazor",
    "Riazor Blues",
    "Dépor",
    "Herculino",
  ],
  "Athletic Club": ["Athletic", "Bilbao", "Leones", "San Mamés"],
  "Sevilla FC": ["Sevilla", "Nervión", "Hispalense", "Sevillistas", "SFC"],
  "Real Betis": [
    "Betis",
    "Béticos",
    "Verdiblanco",
    "Heliópolis",
    "Verdiblancos",
  ],
  "Real Sociedad": [
    "Real Sociedad",
    "Erreala",
    "Txuri-urdin",
    "Donosti",
    "Anoeta",
  ],
  "Valencia CF": [
    "Valencia",
    "Che",
    "Chés",
    "Mestalla",
    "Valencianistas",
    "VCF",
  ],
  "Villarreal CF": ["Villarreal", "Submarino Amarillo", "Groguets", "Cerámica"],
  "Girona FC": ["Girona", "Gironins", "Montilivi", "Blanquivermells"],
  "CA Osasuna": ["Osasuna", "Rojillos", "Sadar", "Pamplona"],
  "Deportivo Alavés": ["Alavés", "Babazorros", "Mendizorrotza", "Glorioso"],
  "Rayo Vallecano": [
    "Rayo Vallecano",
    "Rayo",
    "Vallekas",
    "Franjirrojos",
    "Rayistas",
  ],
  "RC Celta de Vigo": ["Celta", "Vigo", "Celestes", "Balaídos", "Celtiñas"],
  "RCD Mallorca": ["Mallorca", "Bermellones", "Son Moix", "Mallorquinistas"],
  "Getafe CF": ["Getafe", "Azulones", "Coliseum", "Geta"],
  "UD Levante": ["Levante", "Granotas", "Orriols", "Ciutat de València"],
  "Real Oviedo": ["Oviedo", "Carbayones", "Tartiere", "Oviedistas"],
  "Elche CF": ["Elche", "Ilicitanos", "Franjiverdes", "Martínez Valero"],
  "RCD Espanyol": ["Espanyol", "Español", "Pericos", "Blanquiazules", "RCDE"],
};

export type Data = {
  articles: Article[];
  favoriteTeam: string | null;
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const userName = cookies.name;

    if (!userName) {
      return new Response(null, { status: 302, headers: { Location: "/" } });
    }

    const UsersCollection = await getUsersCollection();
    const user = await UsersCollection.findOne({ name: userName });

    const favoriteTeam = user?.favorite || null;
    let articlesDB: any[] = [];

    if (favoriteTeam) {
      const keywordsArray = EQUIPOS_KEYWORDS[favoriteTeam] || [favoriteTeam];

      const regexPattern = keywordsArray.join("|");

      articlesDB = await ArticulosCollection.find({
        $or: [
          { title: { $regex: regexPattern, $options: "i" } },
          { summary: { $regex: regexPattern, $options: "i" } },
          { category: { $regex: regexPattern, $options: "i" } },
        ],
      }).sort({ date: -1 }).toArray();
    }

    const articles: Article[] = articlesDB.map((article) => ({
      id: article._id.toString(),
      title: article.title,
      url: article.url,
      summary: article.summary,
      date: article.date,
      category: article.category,
    }));

    return ctx.render({ articles, favoriteTeam });
  },
};

export default function FavoritesPage(props: PageProps<Data>) {
  const { articles, favoriteTeam } = props.data;

  return (
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">
          {favoriteTeam ? `Noticias del ${favoriteTeam}` : "Tus Favoritos"}
        </h2>
        <p class="page-subtitle">
          Filtrado exclusivamente para ti
        </p>
        <TodasAudioPlayer
          summaries={articles.map((article) => article.summary)}
        />
      </div>

      {!favoriteTeam
        ? (
          <div class="no-news-container">
            <p class="no-news-title">No tienes equipo favorito</p>
            <p class="no-news-text">
              No elegiste ningún equipo al registrarte o hubo un error al
              guardarlo.
            </p>
          </div>
        )
        : articles.length === 0
        ? (
          <div class="no-news-container">
            <p class="no-news-title">Todo tranquilo en el {favoriteTeam}</p>
            <p class="no-news-text">
              El bot no ha encontrado noticias recientes que mencionen a tu
              equipo.
            </p>
          </div>
        )
        : (
          <div class="news-grid">
            {articles.map((article) => (
              <div key={article.id} class="news-card">
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

                  <div class="card-actions">
                    <AudioPlayer summary={article.summary} />
                    <a href={`/news/${article.id}`} class="read-more-btn">
                      Ir a la noticia completa →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
