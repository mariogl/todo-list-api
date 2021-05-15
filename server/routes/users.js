require("dotenv").config();
const debug = require("debug")("todo-list:routes:users");
const express = require("express");
const { loginUser } = require("../controllers/users");
const { respondItem } = require("../controllers");

const router = express.Router();

// Endpoint to log in
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const response = await loginUser(username, password);
  return respondItem(response, res, next);
});

module.exports = router;
