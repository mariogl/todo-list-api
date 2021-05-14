require("dotenv").config();
const debug = require("debug")("todo-list:server");
const express = require("express");
const morgan = require("morgan");
const chalk = require("chalk");
const { serverError, notFoundError, generalError } = require("./errors");

const app = express();

app.use(morgan("dev"));
app.get("/", (req, res, next) => {
  res.send("Hello");
});
app.use(notFoundError);
app.use(generalError);

const initServer = (port) => {
  const server = app.listen(port, () => {
    debug(chalk.yellow(`Server listening on http://localhost:${port}`));
  });

  server.on("error", (err) => serverError(err, port));
};

module.exports = initServer;
