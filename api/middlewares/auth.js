let { decodeAccessToken, createAccessToken } = require("../tokens/accessToken");
let { decodeRefreshToken } = require("../tokens/refreshToken");
let { searchToken, deleteToken } = require("../../database/Request/Refresh");
let { searchUserId} = require("../../database/Request/User");
const useragent = require("express-useragent");

const isAuth = async (req, res, next) => {
  console.log(req.path);
  let refresh = req.cookies.refresh;
  let access = req.cookies.access;
  console.log(access, refresh);
  if (!access && !refresh) {
    return await logout(res,next);
  }
  let decodeAccess = await decodeAccessToken(access);
  if (!decodeAccess) {
    let findToken = await searchToken(refresh);
    let decodeRefresh = decodeRefreshToken(findToken);

    if (!decodeRefresh) {
      await deleteToken(findToken.id);
      return await logout(res,next);
    }
    let searchUser = await searchUserId(decodeRefresh.userID)
    const accessTokenCookie = await createAccessToken({
      userID: searchUser.id,
      userMAIL: searchUser.mail,
      userROLE: searchUser.role,
    });
    let source = await req.headers["user-agent"];
    let ua = useragent.parse(source);
    if (decodeRefresh.browser !== ua.source) {
      await deleteToken(findToken.id);
      return await logout(res,next);
    }
    res
    .status(200)
    .cookie("access", accessTokenCookie, {
      maxAge: 3600000, // 1 час
      httpOnly: true, // Куки доступны только для сервера
      secure: true // Куки передаются только по HTTPS
    })
  }
  await next();
};

module.exports = { isAuth };

const logout = (res,next) => {
  res.redirect("login");
  return next();
};
