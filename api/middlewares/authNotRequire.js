const { decodeAccessToken, createAccessToken } = require("../tokens/accessToken");
const { decodeRefreshToken } = require("../tokens/refreshToken");
const { searchToken, deleteToken } = require("../../database/Request/Refresh");
const { searchUserId } = require("../../database/Request/User");
const useragent = require("express-useragent");

const isAuthNotRequire = async (req, res, next) => {
  let refresh = req.cookies.refresh;
  let access = req.cookies.access;
  if (!access && !refresh) {
    return next();
  }

  let decodeAccess = await decodeAccessToken(access);
  if (!decodeAccess) {
    let findToken = await searchToken(refresh);
    let decodeRefresh = decodeRefreshToken(findToken);

    if (!decodeRefresh) {
      await deleteToken(findToken.id);
      return next();
    }

    let searchUser = await searchUserId(decodeRefresh.userID);
    const accessTokenCookie = await createAccessToken({
      userID: searchUser.id,
      userMAIL: searchUser.mail,
      chatList: searchUser.chatList,
      userROLE: searchUser.role,
    });

    let source = req.headers["user-agent"];
    let ua = useragent.parse(source);
    if (decodeRefresh.browser !== ua.browser) {
      await deleteToken(findToken.id);
      return logout(res, next);
    }

    await res.cookie("access", accessTokenCookie, {
      maxAge: 3600000, // 1 час
      httpOnly: true, // Куки доступны только для сервера
      secure: true, // Куки передаются только по HTTPS
    });

    return res.redirect(req.originalUrl); // Return after redirect to prevent further execution
  }

  return next();
};

module.exports = { isAuthNotRequire };

const logout = (res, next) => {
  console.log("Удаление куки");
  res.clearCookie('access');
  res.clearCookie('refresh');
  return next();
};
