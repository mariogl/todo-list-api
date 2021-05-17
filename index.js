require("dotenv").config();
const debug = require("debug")("todo-list:main");
require("./db"); // DB connection
const options = require("./cli");
const initServer = require("./server");

const port = options.port ?? process.env.port ?? 5000;

initServer(port);
