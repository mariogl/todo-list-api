require("dotenv").config();
const debug = require("debug")("todo-list:routes:todos");
const express = require("express");
const { getToDos } = require("../controllers/toDos");
const statusCodes = require("../statusCodes");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const response = await getToDos();
  res.json(response);
});

router.get("/:idToDo", (req, res, next) => {
  const { idToDo } = req.params;
  res.send(`ToDo ${idToDo} detail`);
});

router.post("/todo", (req, res, next) => {
  res.status(statusCodes.created).send("New ToDo");
});

router.put("/todo/:idToDo", (req, res, next) => {
  const { idToDo } = req.params;
  res.send(`ToDo ${idToDo} modified`);
});

module.exports = router;
