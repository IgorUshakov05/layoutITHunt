const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { searchVacancyById } = require("../database/Request/Vacancy");
const { isFavoriteVacancy } = require("../database/Request/FavoriteVacancy");
const { searchCompanyForVacancy } = require("../database/Request/Company");
const { searchUserId } = require("../database/Request/User");

router.get("/vacancia/:id", isAuthNotRequire, async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  let findVacancy = await searchVacancyById(req.params.id);
  console.log(findVacancy)
  if (!findVacancy.success || !req.params.id) return res.redirect("/404");
  let findFromUser = await searchUserId(findVacancy.data.userID);
  let company = await searchCompanyForVacancy(findFromUser.id);
  console.log(findFromUser || company);
  let isFavoriteVacancyVar = false;
  if (findFromUser) {
    isFavoriteVacancyVar = await isFavoriteVacancy(user.userID, req.params.id);
  }
  return await res.render("vacansyaItem", {
    isLoggedIn: !!user,
    id: user.userID,
    chatList: user.chatList || null,
    vacancy: findVacancy.data,
    from: company || findFromUser,
    isFav: isFavoriteVacancyVar,
  });
});

module.exports = router;
