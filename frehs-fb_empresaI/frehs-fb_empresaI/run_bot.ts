import { runBotUpdate } from "./services/bot.ts";
import "jsr:@std/dotenv/load"; // Carga las claves del .env

console.log("Iniciando prueba manual del Bot");

try {
  await runBotUpdate();
  console.log("Prueba finalizada correctamente.");
  Deno.exit(0);
} catch (error) {
  console.error("Hubo un error:", error);
  Deno.exit(1);
}
