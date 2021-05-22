require("dotenv").config();
const debug = require("debug")("todo-list:cli");
const { program } = require("commander");

// Parameters for CLI
program.option("-p, --port <port>", "Port for the server");
program.parse();

module.exports = program.opts();
