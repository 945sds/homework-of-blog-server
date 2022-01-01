const jwt = require("jsonwebtoken");
const config = require("../config/default.json");
//验证jwt
module.exports = function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
