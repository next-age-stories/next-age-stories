import * as ts from "typescript";
import pkg from "../package.json";

console.log("sw installed");

const compilerOptions = {
  module: ts.ModuleKind.ESNext,
  sourcemap: false,
  jsx: "react"
};

import { transform } from "@babel/core/lib/transform";
import flow from "@babel/preset-flow";
import react from "@babel/preset-react";
import pluginSyntaxDynamicImport from "@babel/plugin-syntax-dynamic-import";

import rewriteModulePath from "./rewriteModulePath";

self.addEventListener("install", function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

const fetchBabeledJS = async url => {
  const res = await fetch(url);
  const source = await res.text();
  const output = transform(source, {
    presets: [flow, react],
    plugins: [
      pluginSyntaxDynamicImport,
      [
        rewriteModulePath,
        {
          filename: url
        }
      ]
    ]
  }).code;
  console.log("compiled", output);
  return new Response(output, {
    mode: "no-cors",
    headers: { "Content-Type": "text/javascript" }
  });
};

const fetchTypeScriptJS = async url => {
  const res = await fetch(url);
  const source = await res.text();

  const tsCompiled = ts.transpileModule(source, { compilerOptions });

  // rewrite module path
  const output = transform(tsCompiled.outputText, {
    plugins: [
      [
        rewriteModulePath,
        {
          filename: url
        }
      ]
    ]
  }).code;

  console.log("compiled", output);
  return new Response(output, {
    mode: "no-cors",
    headers: { "Content-Type": "text/javascript" }
  });
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
  } else if (event.request.url.indexOf(".js") > -1) {
    console.log("transform by babel", event.request.url);
    event.respondWith(fetchBabeledJS(event.request.url));
  } else if (
    event.request.url.indexOf(".ts") > -1 ||
    event.request.url.indexOf(".tsx") > -1
  ) {
    console.log("transform by typescript", event.request.url);
    event.respondWith(fetchTypeScriptJS(event.request.url));
  }
});
