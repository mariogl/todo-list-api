require("dotenv").config();
const debug = require("debug")("todo-list:routes:todos");
const express = require("express");
const {
  getToDos,
  getToDo,
  createToDo,
  modifyToDo,
  deleteToDo,
} = require("../controllers/toDos");
const statusCodes = require("../statusCodes");
const { respondItem } = require("../controllers");
const {
  validateIdParam,
  validateToDoBody,
  validateToDoWithIdBody,
} = require("../middlewares/validation");

const router = express.Router();

// Endpoint to request the ToDos list
router.get("/", async (req, res, next) => {
  const response = await getToDos(req.userId);
  res.json(response);
});

// Endpoint to request a single ToDo by its Id
// The Id is sent in an URL segment
router.get(
  "/:idToDo",
  validateIdParam, // Id format validation
  async (req, res, next) => {
    let response;
    if (req.validationError) {
      response = {
        error: req.validationError,
      };
    } else {
      const { idToDo } = req.params;
      response = await getToDo(req.userId, idToDo);
    }
    return respondItem(response, res, next);
  }
);

// Endpoint to create a ToDo
// The ToDo is sent in request body
router.post(
  "/todo",
  validateToDoBody, // // Body validation
  async (req, res, next) => {
    let response;
    if (req.validationError) {
      response = {
        error: req.validationError,
      };
    } else {
      const newToDo = req.body;
      response = await createToDo(req.userId, newToDo);
    }
    return respondItem(response, res, next);
  }
);

// Endpoint to modify a ToDo by its Id
// The modified ToDo is sent in request body
router.put(
  "/todo",
  validateToDoWithIdBody, // // Body validation
  async (req, res, next) => {
    let response;
    if (req.validationError) {
      response = {
        error: req.validationError,
      };
    } else {
      const modifiedToDo = req.body;
      response = await modifyToDo(req.userId, modifiedToDo);
    }
    return respondItem(response, res, next);
  }
);

// Endpoint to delete a ToDo by its Id
// The deleted ToDo is sent in request body
router.delete(
  "/todo/:idToDo",
  validateIdParam, // Id format validation
  async (req, res, next) => {
    let response;
    if (req.validationError) {
      response = {
        error: req.validationError,
      };
    } else {
      const { idToDo } = req.params;
      response = await deleteToDo(req.userId, idToDo);
    }
    return respondItem(response, res, next);
  }
);

module.exports = router;
