const serve = require("webpack-serve");
const path = require("path");
const config = require("./serve.config");
const generateManifest = require("./generateManifest");

const root = path.join(__dirname, "../../example");
generateManifest(root);
serve({ config });
