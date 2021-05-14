const debug = require("debug")("todo-list:errors");
const chalk = require("chalk");
const statusCodes = require("./statusCodes");

const generateError = (message, status) => {
  const error = new Error(message);
  error.code = status;
  return error;
};

const serverError = (err, port) => {
  debug(chalk.red.bold("General server error"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red.bold(`Port ${port} is not available.`));
  }
};

const notFoundError = (req, res, next) => {
  const error = generateError(
    "The endpoint doesn't exist",
    statusCodes.notFound
  );
  next(error);
};

const generalError = (err, req, res, next) => {
  const error = {
    code: err.code || statusCodes.serverError,
    message: err.code ? err.message : "General error",
  };
  res.status(error.code).json({ error: true, message: error.message });
};

module.exports = {
  generateError,
  serverError,
  notFoundError,
  generalError,
};
