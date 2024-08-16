const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { searchVacancyById } = require("../database/Request/Vacancy");
const {searchUserId} = require("../database/Request/User")

router.get("/vacancia/:id", isAuthNotRequire, async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  let findVacancy = await searchVacancyById(req.params.id);
  let findFromUser = await searchUserId(findVacancy.data.userID);
  console.log(findVacancy);
  return await res.render("vacansyaItem", {
    isLoggedIn: !!user,
    id: user.userID,
    chatList: user.chatList || null,
    vacancy: findVacancy.data,
    from: findFromUser,
  });
});

module.exports = router;
