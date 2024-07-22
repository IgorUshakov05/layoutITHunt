let { decodeAccessToken, createAccessToken } = require("../tokens/accessToken");
let { decodeRefreshToken } = require("../tokens/refreshToken");
let { searchToken, deleteToken } = require("../../database/Request/Refresh");
let { searchUserId} = require("../../database/Request/User");
const useragent = require("express-useragent");

const isAuth = async (req, res, next) => {
  try {

    console.log(`isAuth: req.path = ${req.path}`);
    let refresh = req.cookies.refresh;
  let access = req.cookies.access;

  console.log(`isAuth: access = ${access}`);
  console.log(`isAuth: refresh = ${refresh}`);

  if (!access && !refresh) {
    console.log(`isAuth: No access and refresh tokens. Calling logout`);
    return await logout(res, next);
  }

  let decodeAccess = await decodeAccessToken(access);
  console.log(`isAuth: decodeAccess = ${JSON.stringify(decodeAccess)}`);

  if (!decodeAccess) {
    console.log(`isAuth: decodeAccess is null, searching for refresh token`);
    let findToken = await searchToken(refresh);
    console.log(`isAuth: findToken = ${JSON.stringify(findToken)}`);

    let decodeRefresh = decodeRefreshToken(findToken);
    console.log(`isAuth: decodeRefresh = ${JSON.stringify(decodeRefresh)}`);

    if (!decodeRefresh) {
      console.log(`isAuth: decodeRefresh is null, deleting token`);
      await deleteToken(findToken.id);
      console.log(`isAuth: Token deleted. Calling logout`);
      return await logout(res, next);
    }

    let searchUser = await searchUserId(decodeRefresh.userID);
    console.log(`isAuth: searchUser = ${JSON.stringify(searchUser)}`);

    const accessTokenCookie = await createAccessToken({
      userID: searchUser.id,
      userMAIL: searchUser.mail,
      chatList: searchUser.chatList,
      userROLE: searchUser.role,
    });
    console.log(`isAuth: accessTokenCookie = ${accessTokenCookie}`);

    let source = await req.headers["user-agent"];
    console.log(`isAuth: source = ${source}`);

    let ua = useragent.parse(source);
    console.log(`isAuth: ua = ${JSON.stringify(ua)}`);

    if (decodeRefresh.browser !== ua.source) {
      console.log(`isAuth: Browser mismatch, deleting token`);
      await deleteToken(findToken.id);
      console.log(`isAuth: Token deleted. Calling logout`);
      return await logout(res, next);
    }

    console.log(`isAuth: Setting new access cookie`);
    await res.status(200);
    await res.cookie("access", accessTokenCookie, {
      maxAge: 3600000, // 1 час
      httpOnly: true, // Куки доступны только для сервера
      secure: true // Куки передаются только по HTTPS
    });
    
    console.log(`isAuth: Calling next()`);
    return await next();
  }
  
  console.log(`isAuth: Access token is valid. Calling next()`);
  await next();
}
catch(e) {
  console.log(e)
  return logout(res,next)
};
}


module.exports = { isAuth };

const logout = async (res,next) => {
  await res.redirect("/login");
  return await next()
};
