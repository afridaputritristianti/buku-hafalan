/* Cache sederhana supaya aplikasi bisa dibuka offline. Naikkan VERSI tiap ada perubahan file. */
const VERSI="hafalan-v1";
const FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","privasi.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSI).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSI).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  /* halaman: coba jaringan dulu supaya update langsung terbaca, cadangan dari cache */
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSI).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
