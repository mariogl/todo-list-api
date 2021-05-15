require("dotenv").config();
const debug = require("debug")("todo-list:controllers:users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createResponse } = require(".");
const { generateError } = require("../errors");
const User = require("../../db/models/user");
const statusCodes = require("../statusCodes");

const loginUser = async (username, password) => {
  const foundUser = await User.findOne({ username });
  if (!foundUser) {
    return createResponse(
      generateError("User not found", statusCodes.notFound)
    );
  }
  const matches = await bcrypt.compare(password, foundUser.password);
  if (!matches) {
    return createResponse(
      generateError("Incorrect login data", statusCodes.forbidden)
    );
  }
  const token = jwt.sign(
    {
      id: foundUser._id,
      name: foundUser.name,
    },
    process.env.JWT_SIGNATURE_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  return createResponse(null, { token });
};

module.exports = {
  loginUser,
};
