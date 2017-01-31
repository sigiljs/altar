function trapezoid() {
  var e = { urlsToCache: [],
    processors: { GET: [] },
    processCache(n, t) { n.waitUntil(caches.open(t).then(n => n.addAll(e.urlsToCache))); },
    doProcessor(e, n) {
      return new Promise((t) => {
        let s = { status: 200, statusText: 'OK', headers: { 'Content-Type': 'text/html' } },
          r = { type(e) { s['Content-Type'] = e; }, send(e) { const n = new Response(e, s); t(n); } }; e.fn(n, r);
      });
    },
    processFetch(n) { n.respondWith(caches.match(n.request).then((t) => { if (t) return t; for (var s = n.request.method, r = n.request.url.substr(self.location.href.lastIndexOf('/')), o = e.processors[s], c = null, u = 0; u < o.length; u++) if (o[u].path === r) { c = o[u]; break; } return c ? c.offline ? new Promise((t) => { fetch(n.request).then((e) => { t(e); }).catch(() => { e.doProcessor(c, n.request).then((e) => { t(e); }); }); }) : e.doProcessor(c, n.request) : fetch(n.request); })); },
    get(n, t) { e.processors.GET.push({ path: n, fn: t }); },
    offline(n, t) { e.processors.GET.push({ path: n, fn: t, offline: !0 }); },
    precache(n) { Array.isArray(n) ? e.urlsToCache = e.urlsToCache.concat(n) : e.urlsToCache.push(n); },
    run(n) { self.addEventListener('install', (t) => { e.processCache(t, n); }), self.addEventListener('fetch', (n) => { e.processFetch(n); }); } }; return e;
}

app.precache('/');
app.precache('/app.css');
