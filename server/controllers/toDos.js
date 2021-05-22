require("dotenv").config();
const debug = require("debug")("todo-list:controllers:todos");
const ToDo = require("../../db/models/todo");
const statusCodes = require("../statusCodes");
const { generateCustomError } = require("../errors");
const { createResponse } = require(".");

const cleanProjection = "-user -__v"; // We don't want these fields in JSON output

const getToDos = async () => {
  const toDos = await ToDo.find({}, cleanProjection);
  return createResponse(
    generateCustomError("Resource not found", statusCodes.notFound),
    toDos
  );
};

const getToDo = async (idToDo) => {
  try {
    const toDo = await ToDo.findOne({ _id: idToDo }, cleanProjection);
    return createResponse(
      generateCustomError("Resource not found", statusCodes.notFound),
      toDo
    );
  } catch (error) {
    return createResponse(
      generateCustomError(error.message, statusCodes.serverError)
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
      generateCustomError(error.message, statusCodes.serverError)
    );
  }
};

const modifyToDo = async (userId, toDo) => {
  try {
    toDo.user = userId;
    const toDoModified = await ToDo.findOneAndUpdate(
      { _id: toDo.id, user: userId },
      toDo
    );
    return createResponse(
      generateCustomError("User not found", statusCodes.notFound),
      toDoModified
    );
  } catch (error) {
    return createResponse(
      generateCustomError(error.message, statusCodes.serverError)
    );
  }
};

module.exports = {
  getToDos,
  getToDo,
  createToDo,
  modifyToDo,
};
