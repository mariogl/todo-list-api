require("dotenv").config();
const debug = require("debug")("todo-list:controllers:todos");
const ToDo = require("../../db/models/todo");
const statusCodes = require("../statusCodes");
const { generateError } = require("../errors");
const { createResponse } = require(".");

const cleanProjection = "-user -__v"; // We don't want these fields in JSON output

const getToDos = async () => {
  const toDos = await ToDo.find({}, cleanProjection);
  return createResponse(
    generateError("Resource not found", statusCodes.notFound),
    toDos
  );
};

const getToDo = async (idToDo) => {
  try {
    const toDo = await ToDo.findOne({ _id: idToDo }, cleanProjection);
    return createResponse(
      generateError("Resource not found", statusCodes.notFound),
      toDo
    );
  } catch (error) {
    return createResponse(
      generateError(error.message, statusCodes.serverError)
    );
  }
};

const createToDo = async (userId, toDo) => {
  try {
    toDo.user = userId;
    const toDoCreated = await ToDo.create(toDo);
    return createResponse(null, toDoCreated);
  } catch (error) {
    return createResponse(
      generateError(error.message, statusCodes.serverError)
    );
  }
};

module.exports = {
  getToDos,
  getToDo,
  createToDo,
};
