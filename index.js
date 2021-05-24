require("dotenv").config();
const debug = require("debug")("todo-list:main");
require("./db"); // DB connection
const cliOptions = require("./cli");
const { initializeServer } = require("./server");

const port = cliOptions.port ?? process.env.PORT ?? 5000;

initializeServer(port);
