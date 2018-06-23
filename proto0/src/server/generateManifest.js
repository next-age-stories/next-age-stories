const fs = require("fs");
const path = require("path");
const glob = require("glob");

module.exports = root => {
  const ret = glob.sync(root + "/**", { nodir: true });
  const files = ret.map(r => "." + r.replace(root, "")).filter(r => {
    return r.includes("package.json") || r.includes("src/");
  });

  const out = path.join(__dirname, "../runner/manifest.json");
  fs.writeFileSync(out, JSON.stringify({ files }));
};
