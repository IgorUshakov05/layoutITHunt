const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");

router.get("/inbox/vacancies", (req, res) => {
  let access = req.cookies.access;
  let user = decodeAccessToken(access);
  if (!access || !user) return res.redirect("/login");
  
  res.render("inboxVacansy", {
    isLoggedIn: !!user,
    id: user.userID,
    role: user.userROLE,
    chatList: user.chatList || null,
  });
});

module.exports = router;
