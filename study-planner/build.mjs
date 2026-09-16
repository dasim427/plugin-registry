/**
 * Собирает index.html — автономную версию приложения, которую можно открыть
 * прямо с диска. app.html — исходник: он же публикуется как артефакт, где
 * платформа сама оборачивает содержимое в документ и добавляет <head>.
 *
 * Запуск: node build.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const body = await readFile(join(here, "app.html"), "utf8");

const page = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
  :root{color-scheme:light dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
  body{margin:0;font:14px system-ui,sans-serif;background:#f7f7f5}
  img{max-width:100%}
  [hidden]{display:none!important}
</style>
</head>
<body>
${body}
</body>
</html>
`;

await writeFile(join(here, "index.html"), page);
console.log("index.html собран (" + Math.round(page.length / 1024) + " КБ)");
