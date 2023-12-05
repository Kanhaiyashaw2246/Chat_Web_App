const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "kanhaiya", { expiresIn: "30d" });
};

module.exports = generateToken;