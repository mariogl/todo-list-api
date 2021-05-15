const Joi = require("joi-oid");

const toDoParamsSchema = Joi.object({
  idToDo: Joi.objectId(),
});

const toDoBodySchema = Joi.object({
  description: Joi.string().required(),
  priority: Joi.number().min(1).max(3).required(),
  done: Joi.boolean().required(),
});

module.exports = {
  toDoParamsSchema,
  toDoBodySchema,
};
