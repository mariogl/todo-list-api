const { Schema, model } = require("mongoose");

const ToDoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ToDo = model("ToDo", ToDoSchema, "todos");

module.exports = ToDo;
