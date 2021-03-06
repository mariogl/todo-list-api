require("dotenv").config();
const debug = require("debug")("todo-list:controllers:todos");
const ToDo = require("../../db/models/todo");
const statusCodes = require("../statusCodes");
const { generateCustomError } = require("../errors");
const { createResponse } = require(".");

const cleanProjection = "-user -__v"; // We don't want these fields in JSON output

const getToDos = async (userId) => {
  const toDos = await ToDo.find({ user: userId }, cleanProjection);
  return createResponse(
    generateCustomError("Resource not found", statusCodes.notFound),
    toDos.map((toDo) => {
      const toDoRenamedId = {
        ...toDo.toObject(),
        id: toDo._id,
      };
      delete toDoRenamedId._id;
      return toDoRenamedId;
    })
  );
};

const getToDo = async (userId, idToDo) => {
  try {
    const toDo = await ToDo.findOne(
      { _id: idToDo, user: userId },
      cleanProjection
    );
    const toDoRenamedId = {
      ...toDo.toObject(),
      id: toDo._id,
    };
    delete toDoRenamedId._id;
    return createResponse(
      generateCustomError("Resource not found", statusCodes.notFound),
      toDoRenamedId
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

const deleteToDo = async (userId, idToDo) => {
  try {
    const removedToDo = await ToDo.deleteOne({ _id: idToDo, user: userId });
    let removedToDoId;
    if (removedToDo.deletedCount === 1) {
      removedToDoId = {
        id: idToDo,
      };
    }
    return createResponse(
      generateCustomError("ToDo not found", statusCodes.notFound),
      removedToDoId
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
  deleteToDo,
};
