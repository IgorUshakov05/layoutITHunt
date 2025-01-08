const { Router } = require("express");
const router = Router();
let { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuth } = require("../api/middlewares/auth");

router.get("/buy-premium", isAuth, async (req, res) => {
  let access = req.cookies.access;
  let user = decodeAccessToken(access);
  console.log(user);
  res.render("buy-premium", {
    isLoggedIn: !!user,
    id: user.userID,
    role: user.userROLE,
    chatList: user.chatList || null,
  });
});

module.exports = router;
