const debug = require("debug")("todo-list:errors");
const chalk = require("chalk");

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
  const error = generateError("The endpoint doesn't exist", 404);
  next(error);
};

const generalError = (err, req, res, next) => {
  const error = {
    code: err.code || 500,
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
