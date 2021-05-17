const Joi = require("joi-oid");

const toDoParamsSchema = Joi.object({
  idToDo: Joi.objectId(),
});

const toDoSchema = {
  description: Joi.string().required(),
  priority: Joi.number().min(1).max(3).required(),
  done: Joi.boolean().required(),
};
const toDoWithIdSchema = {
  ...toDoSchema,
  id: Joi.objectId().required(),
};

const toDoBodySchema = Joi.object(toDoSchema);

const toDoWithIdBodySchema = Joi.object(toDoWithIdSchema);

module.exports = {
  toDoParamsSchema,
  toDoBodySchema,
  toDoWithIdBodySchema,
};
