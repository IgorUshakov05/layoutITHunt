const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { findCompanyOfINN } = require("../database/Request/Company");
router.get("/company/:id", isAuthNotRequire, async (req, res) => {
  let access = await req.cookies.access;
  let user = decodeAccessToken(access);
  let companyId = req.params.id;
  if (!companyId) return res.redirect("/");
  let company = await findCompanyOfINN(companyId);
  console.log(company);
  if (!company.success) return res.redirect("/404");
  await res.render("company", {
    isLoggedIn: !!user,
    id: user.userID,
    chatList: user.chatList || null,
    company: company.data,
  });
});

module.exports = router;
