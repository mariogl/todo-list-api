require("dotenv").config();
const debug = require("debug")("todo-list:routes:todos");
const express = require("express");
const { getToDos, getToDo } = require("../controllers/toDos");
const statusCodes = require("../statusCodes");
const { respondItem } = require("../controllers");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const response = await getToDos();
  res.json(response);
});

router.get("/:idToDo", async (req, res, next) => {
  const { idToDo } = req.params;
  const response = await getToDo(idToDo);
  if (response.error) {
    return next(response.error);
  }
  return respondItem(response, res, next);
});

router.post("/todo", (req, res, next) => {
  res.status(statusCodes.created).send("New ToDo");
});

router.put("/todo/:idToDo", (req, res, next) => {
  const { idToDo } = req.params;
  res.send(`ToDo ${idToDo} modified`);
});

module.exports = router;
