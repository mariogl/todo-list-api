require("dotenv").config();
const debug = require("debug")("todo-list:main");

const options = require("./cli");
const initServer = require("./server");

const port = options.port || process.env.port || 7000;

initServer(port);
