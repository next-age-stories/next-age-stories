const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const argv = require("minimist")(process.argv.slice(2));

const target = path.join(__dirname, "../example");

module.exports = {
  mode: "development",
  entry: {
    sw: path.join(__dirname, "serviceWorker/index.js"),
    ui: path.join(__dirname, "ui/index.js")
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/runner",
    publicPath: "/"
  },
  resolve: {
    alias: {
      // avoid build error in @babel/core
      fs: path.join(__dirname, "serviceWorker/dummyFS.js")
    }
  }
  // plugins: [
  //   new CopyPlugin([
  //     {
  //       from: target,
  //       to: path.join(__dirname, "runner/_src"),
  //       toType: "dir"
  //     }
  //   ])
  // ]
};
