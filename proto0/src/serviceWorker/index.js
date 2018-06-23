import path from "path";
import url from "url";
import { transformWithBabel } from "./transformWithBabel";
import { transformWithTypeScript } from "./transformWithTypescript";
import pkg from "../../example/package.json";

console.log("sw installed");

self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event =>
  event.waitUntil(self.clients.claim())
);

setupForChrome();

const reactVersion = pkg.dependencies["react"] || pkg.devDependencies["react"];
const reactDomVersion =
  pkg.dependencies["react-dom"] || pkg.devDependencies["react-dom"];
const previewTemplate = props => `
<head>
  <title>Story Preview</title>
  <meta charset="utf8">
</head>

<body>
  <div id=root>
    Loading...
  </div>

  <script type=module>
  import React from 'https://dev.jspm.io/react@${reactVersion}'
  import ReactDOM from 'https://dev.jspm.io/react-dom@${reactDomVersion}'
  import Component from '${props.url}'
  const propsString = "${props.url}".split('?')[1] || '{}'
  const el = document.querySelector('#root')
  try {
    const props = JSON.parse(decodeURIComponent(propsString))
    ReactDOM.render(React.createElement(Component, props), el)
  } catch(e) {
    el.innerHTML(e.message)
  }
  </script>
</body>
</html>
`;

function setupForChrome() {
  const compilers = {
    ".js": transformWithBabel,
    ".ts": transformWithTypeScript,
    ".tsx": transformWithTypeScript
  };

  self.addEventListener("fetch", event => {
    const parsed = url.parse(event.request.url);

    if (parsed.pathname.startsWith("/preview")) {
      // generate preview html
      const sourceUrl = event.request.url.replace("/preview", "");
      console.log("todo: build preview for", sourceUrl);
      event.respondWith(
        fetch(sourceUrl)
          .then(res => res.text())
          .then(source => {
            const extname = path.extname(sourceUrl);
            const compiler = compilers[extname] || (i => i);
            const output = previewTemplate({
              js: compiler(source),
              url: sourceUrl
            });
            return new Response(output, {
              mode: "no-cors",
              headers: { "Content-Type": "text/html" }
            });
          })
      );
    } else if (event.request.url.indexOf("jspm.io") > -1) {
      // cache jspm result
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
      const extname = path.extname(event.request.url).split("?")[0];
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
