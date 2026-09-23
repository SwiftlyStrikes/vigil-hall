/* Vigil Hall service worker: the whole game is one page, so cache the shell and serve it offline.
   The page itself is fetched from the network first (so a new upload shows on the very next launch) and served from the
   cache only when offline; icons and the manifest are cache first. Bump CACHE with every upload. */
var CACHE = "vigil-hall-v8";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("message", function(e){ if(e.data === "skipWaiting") self.skipWaiting(); });
function isPage(req, url){ return req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html"); }
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if(url.origin !== location.origin){   /* fonts and such: network, quietly fall back to nothing offline */
    e.respondWith(fetch(e.request).catch(function(){ return new Response("", { status: 204 }); }));
    return;
  }
  if(isPage(e.request, url)){
    /* the game page: network first (never the browser's HTTP cache), the cached copy when offline */
    e.respondWith(fetch(new Request(e.request, { cache: "no-cache" })).then(function(res){
      if(res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); }
      return res;
    }).catch(function(){ return caches.match(e.request, { ignoreSearch: true }).then(function(hit){ return hit || caches.match("./index.html"); }); }));
    return;
  }
  /* icons, manifest: cache first, refreshed in the background */
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function(hit){
    var refresh = fetch(e.request).then(function(res){ if(res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); } return res; }).catch(function(){ return hit; });
    return hit || refresh;
  }));
});
