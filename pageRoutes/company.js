const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { findCompanyOfINN } = require("../database/Request/Company");
router.get("/company/:id", isAuthNotRequire, async (req, res) => {
  let access = await req.cookies.access;
  let user = await decodeAccessToken(access);
  let companyId = req.params.id;
  if (!companyId) return res.redirect("/");
  let company = await findCompanyOfINN(companyId, user.userID);
  console.log(user.userID ? user.userID === company?.data?.creatorID : false);
  if (!company.success) return res.redirect("/404");
  await res.render("company", {
    isLoggedIn: !!user,
    id: user.userID,
    isCreator: user ? user.userID === company.data.creatorID : false,
    isEmployee: company?.data?.userList.some(
      (item) => item.userID === user.userID
    ),
    chatList: user.chatList || null,
    company: company.data,
  });
});

module.exports = router;
