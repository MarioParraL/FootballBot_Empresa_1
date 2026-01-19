// seed.ts
import { MongoClient } from "npm:mongodb";
import { ArticleDB } from "./types.ts";
import "jsr:@std/dotenv/load"; // Carga el archivo .env automáticamente

const url = Deno.env.get("MONGO_URL");

if (!url) {
  console.error("❌ Error: No hay MONGO_URL en el .env");
  Deno.exit(1);
}

const client = new MongoClient(url);

const main = async () => {
  try {
    await client.connect();
    console.log("✅ Conectado a la base de datos...");

    const db = client.db("ArticulosDB");
    const collection = db.collection<ArticleDB>("articulos");

    // Borramos datos viejos para no duplicar si lo ejecutas varias veces
    await collection.deleteMany({});
    console.log("🗑️  Datos antiguos eliminados.");

    // Datos de prueba
    const noticiasFalsas: ArticleDB[] = [
      {
        title: "Mbappé marca hat-trick en su debut",
        url: "https://marca.com",
        summary:
          "En un partido emocionante, Kylian Mbappé demostró su calidad marcando tres goles decisivos para la victoria del equipo.",
        date: new Date().toISOString(),
        category: "partido",
      },
      {
        title: "Rumores de fichaje: Davies al Madrid",
        url: "https://as.com",
        summary:
          "Fuentes cercanas aseguran que el lateral canadiense tiene un preacuerdo firmado para la próxima temporada.",
        date: new Date().toISOString(),
        category: "fichajes",
      },
    ];

    await collection.insertMany(noticiasFalsas);
    console.log("🎉 ¡Datos insertados correctamente!");
  } catch (error) {
    console.error("Error poblando la base de datos:", error);
  } finally {
    await client.close();
  }
};

main();
