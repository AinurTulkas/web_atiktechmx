// Service worker del Control de Publicaciones (Cherry Travels).
// Hace instalable la página como app y deja abrir la última versión vista si no hay internet.
// NO guarda datos: las publicaciones salen siempre de Firestore. La página se pide primero a la red
// (así una versión nueva se ve al abrir) y solo si falla se usa la copia guardada.
const CACHE = "publicaciones-v1";
const PAGINA = "/pip3mktr0l0.html";

self.addEventListener("install", (e) => {
  // guarda la página desde el primer momento (si falla, no pasa nada: se guarda en la próxima visita)
  e.waitUntil(caches.open(CACHE).then(c => c.add(PAGINA)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const claves = await caches.keys();
    await Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.mode !== "navigate") return;   // solo la propia página
  e.respondWith((async () => {
    try {
      const resp = await fetch(req);
      if (resp && resp.ok) (await caches.open(CACHE)).put(PAGINA, resp.clone());
      return resp;
    } catch (err) {
      const copia = await caches.match(PAGINA);
      return copia || new Response("Sin conexión. Abre el calendario cuando tengas internet.", {
        status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  })());
});
