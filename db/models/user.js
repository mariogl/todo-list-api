const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  last_login: Date,
});

const User = model("User", UserSchema, "users");

module.exports = User;
