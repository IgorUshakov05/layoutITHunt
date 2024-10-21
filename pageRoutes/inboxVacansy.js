const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { getAllRespond } = require("../database/Request/Vacancy");
router.get("/inbox/vacancies", async (req, res) => {
  let access = req.cookies.access;
  console.log(req.query);
  let user = await decodeAccessToken(access);
  if (!access || !user) return res.redirect("/login");
  let { vacancies, users, success } = await getAllRespond(
    user.userID,
  );
  if (!success) return res.redirect("/");
  return await res.render("inboxVacansy", {
    isLoggedIn: !!user,
    id: user.userID,
    vacancies,
    users,
    role: user.userROLE,
    chatList: user.chatList || null,
  });
});

module.exports = router;
