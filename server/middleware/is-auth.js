const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    const error = new Error("No autenticado");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      const error = new Error("Token inválido");
      error.statusCode = 403;
      throw error;
    }

    req.userId = user.userId;
  });

  next();
};
