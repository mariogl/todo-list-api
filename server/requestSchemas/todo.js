const Joi = require("joi-oid");

const toDoParamsSchema = Joi.object({
  idToDo: Joi.objectId(),
});

module.exports = toDoParamsSchema;
