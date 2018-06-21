module.exports = {
  mode: "development",
  entry: [__dirname + "/sw/index.js"],
  output: {
    filename: "sw.js",
    path: __dirname + "/",
    publicPath: "/"
  },
  resolve: {
    alias: {
      fs: __dirname + "/sw/fs.js"
    }
  }
};
