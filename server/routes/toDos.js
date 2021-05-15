require("dotenv").config();
const debug = require("debug")("todo-list:routes:todos");
const express = require("express");
const { param, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { getToDos, getToDo } = require("../controllers/toDos");
const { generateError } = require("../errors");
const statusCodes = require("../statusCodes");
const { respondItem } = require("../controllers");
const { validateIdParam } = require("../middlewares/validation");

const router = express.Router();

// Endpoint to request the ToDos list
router.get("/", async (req, res, next) => {
  const response = await getToDos();
  res.json(response);
});

// Endpoint to request a single ToDo by its Id
// The Id is sent in an URL segment
router.get(
  "/:idToDo",
  // Id format validation
  validateIdParam("idToDo"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.mapped().idToDo) {
      return next(
        generateError(errors.mapped().idToDo.msg, statusCodes.badRequest)
      );
    }
    const { idToDo } = req.params;
    const response = await getToDo(idToDo);
    if (response.error) {
      return next(response.error);
    }
    return respondItem(response, res, next);
  }
);

// Endpoint to create a ToDo
// The ToDo is sent in request body
router.post("/todo", (req, res, next) => {
  res.status(statusCodes.created).send("New ToDo");
});

// Endpoint to modify a ToDo by its Id
// The Id is sent in an URL segment
// The modified ToDo is sent in request body
router.put("/todo/:idToDo", (req, res, next) => {
  const { idToDo } = req.params;
  res.send(`ToDo ${idToDo} modified`);
});

module.exports = router;
