const path = require("path");
const convert = require("koa-connect");
const static = require("koa-static");
const Router = require("koa-router");
const glob = require("glob");
const config = require("../webpack.config");

// const { entry, output } = config;
module.exports = {
  ...config,
  mode: "development",
  serve: {
    hot: false,
    port: 9999,
    content: [__dirname],
    add: (app, middleware, options) => {
      middleware.webpack();
      middleware.content();
      app.use(static(path.join(__dirname, "../../example")));
      app.use(static(path.join(__dirname, "../runner")));
    }
  }
};
