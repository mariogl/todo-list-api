require("dotenv").config();
const debug = require("debug")("todo-list:server");
const express = require("express");
const chalk = require("chalk");
const { serverError } = require("./errors");

const app = express();

const initServer = (port) => {
  const server = app.listen(port, () => {
    debug(chalk.yellow(`Server listening on http://localhost:${port}`));
  });

  server.on("error", (err) => serverError(err, port));
};

module.exports = initServer;
