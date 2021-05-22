require("dotenv").config();
const debug = require("debug")("todo-list:db");
const chalk = require("chalk");
const mongoose = require("mongoose");

const { NODE_ENV, MONGO_URL, MONGO_TEST_URL } = process.env;

mongoose.set("debug", true);
mongoose.connect(
  NODE_ENV === "test" ? MONGO_TEST_URL : MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  async (err) => {
    if (err) {
      debug(chalk.red("Error on connecting to database"));
      debug(chalk.red(err));
      process.exit(1);
    }
    debug(chalk.green("Connected to database"));
  }
);
