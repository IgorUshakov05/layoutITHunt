const modeltoken = require("../Schema/RefreshTokens");
let { v4 } = require("uuid");

const newToken = async (data) => {
  try {
    let newTokenBase = await new modeltoken({
      id: v4(),
      token: data,
    });
    let saveToken = await newTokenBase.save();
    console.log(saveToken);
    return saveToken;
  } catch (e) {
    return false;
  }
};
const searchToken = async (token) => {
  try {
    const firstSix = token.slice(0, 6);
    const lastSix = token.slice(-6);

    const searchToken = await modeltoken.findOne({
      token: { $regex: `${firstSix}.*${lastSix}`, $options: "i" },
    });

    // Нет необходимости вызывать toArray()

    if (searchToken) {
      return searchToken.token;
    }

    return false;
  } catch (e) {
    return false;
  }
};

const deleteTokenCookie = async (token) => {
  try {
    const firstSix = token.slice(0, 6);
    const lastSix = token.slice(-6);

    const searchToken = await modeltoken.deleteOne({
      token: { $regex: `${firstSix}.*${lastSix}`, $options: "i" },
    });

    // Нет необходимости вызывать toArray()

    if (searchToken) {
      return searchToken.token;
    }

    return false;
  } catch (e) {
    return false;
  }
}

const deleteToken = async (id) => {
  try {
    let deleteToken = modeltoken.deleteOne({ id });
    console.log(deleteToken, " - удаленный токен");
    return deleteToken;
  } catch (e) {
    console.log(e, " - ошибка при удалении токена");
    return false;
  }
};

module.exports = { newToken, searchToken,deleteToken,deleteTokenCookie };
