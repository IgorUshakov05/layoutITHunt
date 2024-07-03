let { decodeAccessToken, createAccessToken } = require("../tokens/accessToken");
let { decodeRefreshToken } = require("../tokens/refreshToken");
let { searchToken, deleteToken } = require("../../database/Request/Refresh");
let { searchUserId} = require("../../database/Request/User");
const useragent = require("express-useragent");
const isAuthNotRequire = async (req, res, next) => {
  console.log(req.path);
  let refresh = req.cookies.refresh;
  let access = req.cookies.access;
  console.log(access, refresh);
  if (!access || !refresh) {
    return next();
  }
  let decodeAccess = await decodeAccessToken(access);
  console.log(decodeAccess);
  console.log(access)
  if (!decodeAccess) {
    let findToken = await searchToken(refresh);
    let decodeRefresh = decodeRefreshToken(findToken);

    if (!decodeRefresh) {
      await deleteToken(findToken.id);
      return await next()
    }
    let searchUser = await searchUserId(decodeRefresh.userID)
    console.log(searchUser)
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
    await res
    .status(200)
    .cookie("access", accessTokenCookie, {
      maxAge: 3600000, // 1 час
      httpOnly: true, // Куки доступны только для сервера
      secure: true // Куки передаются только по HTTPS
    })
    await res.redirect(req.originalUrl); 
  }
  return await next();
};

module.exports = { isAuthNotRequire };

const logout = (res,next) => {
  console.log("Удаление куки")
  res.clearCookie('access')
  res.clearCookie('refresh')
  return next();
};
