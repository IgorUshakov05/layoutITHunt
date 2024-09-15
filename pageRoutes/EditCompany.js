const { Router } = require("express");
const router = Router();
const { isAuth } = require("../api/middlewares/auth");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { findCompanyByCreator } = require("../database/Request/Company");

router.get("/editComapny", isAuth, async (req, res) => {
  let access = await req.cookies.access;
  let user = decodeAccessToken(access);
  if (!access || !user) return res.redirect("/");
  let dataCompany = await findCompanyByCreator(user.userID);
  if (!dataCompany.success || !dataCompany.company) return res.redirect("/");
  res.render("EditCompany", {
    isLoggedIn: !!user,
    company: dataCompany.company,
    id: user.userID,
    FILE_SERVER: process.env.FILE_SERVER_PATH,
    chatList: user.chatList || null,
  });
});

module.exports = router;
