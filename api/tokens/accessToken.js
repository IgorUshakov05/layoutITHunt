const jwt = require("jsonwebtoken");

const createAccessToken = (data) => {
  let token = jwt.sign(data, process.env.ACCESS, { expiresIn: process.env.TIMEACCESSTOKEN  });
  return token;
};

const decodeAccessToken = (tokenUser) => {
  try {
    let token = jwt.verify(tokenUser, process.env.ACCESS);
    return token;
  } catch (error) {
    return false;
  }
};

module.exports = { createAccessToken, decodeAccessToken };
