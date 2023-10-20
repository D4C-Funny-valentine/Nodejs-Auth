const bcrypt = require("bcrypt");

const hashData = async (data, sortRound = 10) => {
  try {
    const hashData = await bcrypt.hash(data, sortRound);
    return hashData;
  } catch (error) {
    throw error;
  }
};

const verifyHashData = async (unHashed, hashed) => {
  try {
    const verifyData = await bcrypt.compare(unHashed, hashed);
    return verifyData;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashData, verifyHashData };
