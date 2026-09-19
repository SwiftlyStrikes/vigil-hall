/* Vigil Hall service worker: the whole game is one page, so cache the shell and serve it offline.
   Bump CACHE when you upload a new build so phones pick it up (the page also asks for an update on every launch). */
var CACHE = "vigil-hall-v1";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if(url.origin !== location.origin){   /* fonts and such: network, quietly fall back to nothing offline */
    e.respondWith(fetch(e.request).catch(function(){ return new Response("", { status: 204 }); }));
    return;
  }
  /* the shell: cache first, then refresh the cache from the network in the background */
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function(hit){
    var refresh = fetch(e.request).then(function(res){ if(res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); } return res; }).catch(function(){ return hit; });
    return hit || refresh;
  }));
});
