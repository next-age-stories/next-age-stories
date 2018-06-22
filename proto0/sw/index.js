import path from "path";
import { transformWithBabel } from "./transformWithBabel";
import { transformWithTypeScript } from "./transformWithTypescript";

console.log("sw installed");

self.addEventListener("install", function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

setupForChrome();

function setupForChrome() {
  const compilers = {
    ".js": transformWithBabel,
    ".ts": transformWithTypeScript,
    ".tsx": transformWithTypeScript
  };

  self.addEventListener("fetch", event => {
    // cache jspm
    if (event.request.url.indexOf("jspm.io") > -1) {
      event.respondWith(
        caches.match(event.request).then(res => {
          return (
            res ||
            caches.open("1").then(cache => {
              return fetch(event.request).then(response => {
                console.log("put", event.request.url);
                cache.put(event.request, response.clone());
                return response;
              });
            })
          );
        })
      );
    } else {
      const extname = path.extname(event.request.url);
      const compiler = compilers[extname];
      if (compiler) {
        event.respondWith(
          fetch(event.request.url)
            .then(res => res.text())
            .then(source => {
              const output = compiler(source);
              return new Response(output, {
                mode: "no-cors",
                headers: { "Content-Type": "text/javascript" }
              });
            })
        );
      }
    }
  });
}
