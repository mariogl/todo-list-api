const jwt = require("jsonwebtoken");
const { generateError } = require("../errors");
const statusCodes = require("../statusCodes");

const auth = (req, res, next) => {
  if (req.path.includes("/login")) {
    return next();
  }
  if (!req.header("Authorization")) {
    return next(generateError("Not allowed", statusCodes.forbidden));
  }
  const token = req.header("Authorization").split(" ")[1];
  try {
    const userData = jwt.verify(token, process.env.JWT_SIGNATURE_SECRET);
    req.userId = userData.id;
    next();
  } catch {
    next(generateError("Invalid token", statusCodes.forbidden));
  }
};

module.exports = auth;
