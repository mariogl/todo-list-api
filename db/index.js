require("dotenv").config();
const debug = require("debug")("todo-list:db");
const chalk = require("chalk");
const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose.connect(
  process.env.MONGO_URL,
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
