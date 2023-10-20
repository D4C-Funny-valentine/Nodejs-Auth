const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET, TOKEN_EXPIRE } = process.env;

const createToken = (
  tokenData,
  tokenKey = ACCESS_TOKEN_SECRET,
  expireDate = TOKEN_EXPIRE
) => {
  try {
    const accessToken = jwt.sign(tokenData, tokenKey, {
      expiresIn: expireDate,
    });
    return accessToken;
  } catch (error) {
    throw error;
  }
};

module.exports = createToken;
