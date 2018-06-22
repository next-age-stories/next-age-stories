const url = require("url");
const path = require("path");
const pkg = require("../../package.json");

export default function rewriteModulePath({ types }) {
  return {
    pre(file) {
      this.types = types;
      this._dirname = path.dirname(this.opts.filename || file.opts.filename);
    },

    visitor: {
      ImportDeclaration(nodePath) {
        const importTarget = nodePath.node.source.value;
        const isRelative = importTarget[0] === ".";
        if (isRelative) {
          // add .js
          const extname = path.extname(importTarget);
          const importTargetWithExt = importTarget + (extname ? "" : ".js");
          nodePath.node.source.value = importTargetWithExt;
        } else if (importTarget.includes("https://")) {
          // do nothing
          return;
        } else {
          // rewrite to 'jspm'
          const version =
            pkg.dependencies[importTarget] || pkg.devDependencies[importTarget];
          const suffix = version ? `@${version.replace(/\^|\~/, "")}` : "";
          nodePath.node.source.value = `https://dev.jspm.io/${importTarget}${suffix}`;
        }
      }
    }
  };
}
