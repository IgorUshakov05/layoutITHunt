let { decodeAccessToken, createAccessToken } = require("../tokens/accessToken");
let { decodeRefreshToken } = require("../tokens/refreshToken");
let { searchToken, deleteToken } = require("../../database/Request/Refresh");
let { searchUserId } = require("../../database/Request/User");
const useragent = require("express-useragent");

const isAuth = async (req, res, next) => {
  try {
    let refresh = req.cookies.refresh;
    let access = req.cookies.access;

    if (access === undefined && refresh === undefined) {
      return await logout(res, next);
    }

    let decodeAccess = await decodeAccessToken(access);

    if (!decodeAccess) {
      let findToken = await searchToken(refresh);

      let decodeRefresh = decodeRefreshToken(findToken);

      if (!decodeRefresh) {
        await deleteToken(findToken.id);
        return await logout(res, next);
      }

      let searchUser = await searchUserId(decodeRefresh.userID);

      const accessTokenCookie = await createAccessToken({
        userID: searchUser.id,
        userMAIL: searchUser.mail,
        chatList: searchUser.chatList,
        userROLE: searchUser.role,
      });

      let source = await req.headers["user-agent"];

      let ua = useragent.parse(source);

      if (decodeRefresh.browser !== ua.browser) {
        await deleteToken(findToken.id);
        return await logout(res, next);
      }

      await res.cookie("access", accessTokenCookie, {
        maxAge: 3600000, // 1 час
        httpOnly: true, // Куки доступны только для сервера
        secure: false, // Куки передаются только по HTTPS
        sameSite: 'Strict' // или 'Lax', в зависимости от вашей политики безопасности
      });

      return await next();
    }

    await next();
  } catch (e) {
    console.log(e);
    return logout(res, next);
  }
};

module.exports = { isAuth };

const logout = async (res, next) => {
  return await res.redirect("/login");
};