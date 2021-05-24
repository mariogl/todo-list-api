const jwt = require("jsonwebtoken");
const { generateCustomError } = require("../errors");
const statusCodes = require("../statusCodes");

const auth = (req, res, next) => {
  if (req.path.includes("/login")) {
    return next();
  }
  if (!req.header("Authorization")) {
    return next(generateCustomError("Not allowed", statusCodes.unauthorized));
  }
  const token = req.header("Authorization").split(" ")[1];
  try {
    const userData = jwt.verify(token, process.env.JWT_SIGNATURE_SECRET);
    req.userId = userData.id;
    next();
  } catch {
    next(generateCustomError("Invalid token", statusCodes.unauthorized));
  }
};

module.exports = auth;
