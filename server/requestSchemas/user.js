const Joi = require("joi-oid");

const userBodySchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = userBodySchema;
