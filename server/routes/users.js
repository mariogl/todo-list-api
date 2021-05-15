require("dotenv").config();
const debug = require("debug")("todo-list:routes:users");
const express = require("express");
const { loginUser } = require("../controllers/users");
const { respondItem } = require("../controllers");
const { validateUserBody } = require("../middlewares/validation");

const router = express.Router();

// Endpoint to log in
router.post(
  "/login",
  validateUserBody, // // Body validation
  async (req, res, next) => {
    let response;
    if (req.validationError) {
      response = {
        error: req.validationError,
      };
    } else {
      const { username, password } = req.body;
      response = await loginUser(username, password);
    }
    return respondItem(response, res, next);
  }
);

module.exports = router;
