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
<title>Без снежного кома</title>
<meta name="description" content="Планировщик учебных заданий: разносит работу по свободным окнам между парами.">
<meta name="theme-color" content="#eceee7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#13161b" media="(prefers-color-scheme: dark)">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Задания">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%97%93%EF%B8%8F%3C/text%3E%3C/svg%3E">
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
