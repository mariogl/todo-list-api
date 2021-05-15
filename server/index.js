require("dotenv").config();
const debug = require("debug")("todo-list:server");
const express = require("express");
const morgan = require("morgan");
const chalk = require("chalk");
const { serverError, notFoundError, generalError } = require("./errors");
const routerToDos = require("./routes/toDos");
const routerUsers = require("./routes/users");
const auth = require("./middlewares/auth");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/todos", auth, routerToDos);
app.use("/users", routerUsers);
app.use(notFoundError);
app.use(generalError);

const initServer = (port) => {
  const server = app.listen(port, () => {
    debug(chalk.yellow(`Server listening on http://localhost:${port}`));
  });

  server.on("error", (err) => serverError(err, port));
};

module.exports = initServer;
