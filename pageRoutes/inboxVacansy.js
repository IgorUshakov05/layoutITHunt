const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { getAllRespond } = require("../database/Request/Vacancy");
router.get("/inbox/vacancies", async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  if (!access || !user) return res.redirect("/login");
  let getInbox = await getAllRespond(user.userID);
  return await res.render("inboxVacansy", {
    isLoggedIn: !!user,
    id: user.userID,
    role: user.userROLE,
    chatList: user.chatList || null,
  });
});

module.exports = router;
