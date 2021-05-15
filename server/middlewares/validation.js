require("dotenv").config();
const debug = require("debug")("todo-list:middlewares");
const userBodySchema = require("../requestSchemas/user");
const { generateError } = require("../errors");
const statusCodes = require("../statusCodes");
const toDoParamsSchema = require("../requestSchemas/todo");

const validateSchema = (req, data, schema, message) => {
  const { error } = schema.validate(data);
  if (error) {
    debug(error.message);
    req.validationError = generateError(message, statusCodes.badRequest);
  }
};

const validateIdParam = (req, res, next) => {
  validateSchema(req, req.params, toDoParamsSchema, "Wrong id format");
  next();
};

const validateUserBody = (req, res, next) => {
  validateSchema(req, req.body, userBodySchema, "The request is malformed");
  next();
};

module.exports = {
  validateSchema,
  validateIdParam,
  validateUserBody,
};
