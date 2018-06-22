import { transform } from "@babel/core/lib/transform";
import flow from "@babel/preset-flow";
import react from "@babel/preset-react";
import pluginSyntaxDynamicImport from "@babel/plugin-syntax-dynamic-import";
import rewriteModulePath from "./rewriteModulePath";

export function transformWithBabel(source, filename = "") {
  return transform(source, {
    presets: [flow, react],
    plugins: [
      pluginSyntaxDynamicImport,
      [
        rewriteModulePath,
        {
          filename
        }
      ]
    ]
  }).code;
}

export function transformWithBabelModulePathOnly(source, filename = "") {
  return transform(source, {
    plugins: [
      pluginSyntaxDynamicImport,
      [
        rewriteModulePath,
        {
          filename
        }
      ]
    ]
  }).code;
}
