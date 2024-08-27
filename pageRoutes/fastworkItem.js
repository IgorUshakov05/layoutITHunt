const { Router } = require("express");
const router = Router();
const { isFavoriteFastWork } = require("../database/Request/FavoriteFastWork");
const { searchFastWorkById } = require("../database/Request/FastWork");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { searchCompanyForVacancy } = require("../database/Request/Company");
const { searchUserId } = require("../database/Request/User");

router.get("/fast-work/:id", isAuthNotRequire, async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  let findFastWork = await searchFastWorkById(req.params.id);
  console.log(findFastWork);
  if (!findFastWork.success || !req.params.id) return res.redirect("/404");
  let findFromUser = await searchUserId(findFastWork.data.userID);
  let company = await searchCompanyForVacancy(findFromUser.id);
  console.log(findFromUser || company);
  let isFavoriteVacancyVar = false;
  if (findFromUser && user) {
    isFavoriteVacancyVar = await isFavoriteFastWork(user.userID, req.params.id);
  }
  console.log(user);
  res.render("fast-workItem", {
    isLoggedIn: !!user,
    id: user.userID,
    chatList: user.chatList || null,
    fastWork: findFastWork.data,
    from: company || findFromUser,
    isFav: isFavoriteVacancyVar,
  });
});

module.exports = router;
