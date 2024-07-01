const jwt = require("jsonwebtoken");
const createRefreshToken = async (data) => {
  try {
    let token = await jwt.sign(data, process.env.REFRESH, {
      expiresIn: process.env.TIMEREFRESHTOKEN,
    });
    return token;
  } catch (error) {
    return false;
  }
};

const decodeRefreshToken = (tokenUser) => {
  try {
    let token = jwt.verify(tokenUser, process.env.REFRESH);
    return token;
  } catch (error) {
    return false;
  }
};

module.exports = { createRefreshToken, decodeRefreshToken };
