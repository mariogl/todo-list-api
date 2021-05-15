require("dotenv").config();
const debug = require("debug")("todo-list:errors");
const chalk = require("chalk");
const { validationResult } = require("express-validator");
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
  debug(err);
  const error = {
    code: err.code || statusCodes.serverError,
    message:
      err.code && err.code !== statusCodes.serverError
        ? err.message
        : "General error",
  };
  res.status(error.code).json({ error: true, message: error.message });
};

const checkBadRequest = (req, urlParam) => {
  const errors = validationResult(req);
  let error = null;
  if (!errors.isEmpty()) {
    const errorsMap = errors.mapped();
    debug(errorsMap);

    if (errorsMap[urlParam]) {
      // Check URL params first
      error = generateError(errorsMap[urlParam].msg, statusCodes.badRequest);
    } else {
      // Then check request body
      error = generateError("The request is malformed", statusCodes.badRequest);
    }
  }
  return error;
};

module.exports = {
  generateError,
  serverError,
  notFoundError,
  generalError,
  checkBadRequest,
};
