let { decodeAccessToken } = require("../tokens/accessToken");
let { decodeRefreshToken } = require("../tokens/refreshToken");
let { searchToken, deleteToken } = require("../../database/Request/Refresh");

const isAuth = async (req, res, next) => {
  //   console.log(req.path);
    let refresh = req.cookies.refresh;
    let access = req.cookies.access;
  //   console.log(access,refresh)
  if (!access || !refresh) {
    res.redirect("login");
  }
  next();
  //   let decodeAccess = decodeAccessToken(access);
  //   console.log(decodeAccess);
  //   if (!decodeAccess) {
  //     let findToken = await searchToken(refresh);
  //     let decodeRefresh = decodeRefreshToken(findToken);
  //     if (!decodeRefresh) {
  //       await deleteToken(findToken.id);
  //     //   res.redirect("/login");
  //       return await next();
  //     }
  //     console.log(decodeRefresh, " - из базы");
  //   }
  //   await next();
};

module.exports = { isAuth };
