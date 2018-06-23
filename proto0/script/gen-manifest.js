const fs = require("fs");
const path = require("path");
const glob = require("glob");

const root = path.join(__dirname, "../app");
const ret = glob.sync(root + "/**", { nodir: true });
const files = ret.map(r => "." + r.replace(root, ""));

const out = path.join(__dirname, "../manifest.json");
fs.writeFileSync(out, JSON.stringify({ files }));
