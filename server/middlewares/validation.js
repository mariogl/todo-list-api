require("dotenv").config();
const debug = require("debug")("todo-list:middlewares");
const { param } = require("express-validator");
const mongoose = require("mongoose");

const validateIdParam = (idParam) =>
  param(idParam, "Wrong Id").custom((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );

module.exports = {
  validateIdParam,
};
