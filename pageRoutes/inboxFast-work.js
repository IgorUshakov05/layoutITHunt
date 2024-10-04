const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");

router.get("/inbox/fast-work", (req, res) => {
  let access = req.cookies.access;
  let user = decodeAccessToken(access);
  if (!access || !user) return res.redirect("/login");

  console.log(user);
  res.render("inboxFast-work", {
    isLoggedIn: !!user,
    id: user.userID,
    role: user.userROLE,
    chatList: user.chatList || null,
  });
});

module.exports = router;
