require("dotenv").config();
const debug = require("debug")("todo-list:routes:todos");
const express = require("express");
const { getToDos, getToDo } = require("../controllers/toDos");
const { checkBadRequest } = require("../errors");
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
const idParam = "idToDo";
router.get(
  `/:${idParam}`,
  // Id format validation
  validateIdParam(idParam),
  async (req, res, next) => {
    const badRequestError = checkBadRequest(req, idParam);
    if (badRequestError) {
      return next(badRequestError);
    }
    const { idToDo } = req.params;
    const response = await getToDo(idToDo);
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
