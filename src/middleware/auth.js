const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization || req.headers.Authorization;

  if (!authToken?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  console.log(authToken);

  const token = authToken?.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user;
    return next();
  });
};

module.exports = verifyToken;