require("dotenv").config();
const debug = require("debug")("todo-list:middlewares");
const { userBodySchema } = require("../requestSchemas/user");
const {
  toDoParamsSchema,
  toDoBodySchema,
  toDoWithIdBodySchema,
} = require("../requestSchemas/todo");
const { generateCustomError } = require("../errors");
const statusCodes = require("../statusCodes");

const validateSchema = (req, data, schema, message) => {
  const { error } = schema.validate(data);
  if (error) {
    debug(error.message);
    req.validationError = generateCustomError(message, statusCodes.badRequest);
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

const validateToDoBody = (req, res, next) => {
  validateSchema(req, req.body, toDoBodySchema, "The request is malformed");
  next();
};

const validateToDoWithIdBody = (req, res, next) => {
  validateSchema(
    req,
    req.body,
    toDoWithIdBodySchema,
    "The request is malformed"
  );
  next();
};

module.exports = {
  validateSchema,
  validateIdParam,
  validateUserBody,
  validateToDoBody,
  validateToDoWithIdBody,
};
