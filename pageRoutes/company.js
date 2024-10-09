const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { findFAllFavoriteOfId } = require("../database/Request/FavoriteVacancy");
const {
  findCompanyOfINN,
  getVacansyByCompanyINN,
} = require("../database/Request/Company");
router.get("/company/:id", isAuthNotRequire, async (req, res) => {
  let access = await req.cookies.access;
  let user = await decodeAccessToken(access);
  let companyId = req.params.id;
  if (!companyId) return res.redirect("/");
  let findAllFV = [];
  if (user) {
    findAllFV = await findFAllFavoriteOfId(user.userID);
  }
  console.log(findAllFV.data.vacancyID, " избраннное");
  let company = await findCompanyOfINN(companyId, user.userID);
  if (!company.success) return res.redirect("/404");
  let publication = await getVacansyByCompanyINN(companyId);
  await res.render("company", {
    isLoggedIn: !!user,
    id: user.userID,
    publication,
    myFavorites: findAllFV.data,
    isCreator: user ? user.userID === company.data.creatorID : false,
    isEmployee: company?.data?.userList.some(
      (item) => item.userID === user.userID
    ),
    chatList: user.chatList || null,
    company: company.data,
  });
});

module.exports = router;
