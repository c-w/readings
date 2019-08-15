const process = require("process");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "https://justamouse.com/readings" : "",
};
