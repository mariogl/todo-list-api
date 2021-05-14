const ToDo = require("../../db/models/todo");
const statusCodes = require("../statusCodes");
const { generateError } = require("../errors");
const { createResponse } = require(".");

const getToDos = async () => {
  const toDos = await ToDo.find({}, "-user -__v");
  return createResponse(
    toDos,
    generateError("Resource not found", statusCodes.notFound)
  );
};

module.exports = {
  getToDos,
};
