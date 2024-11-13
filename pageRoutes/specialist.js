const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { getSpecialList } = require("../database/Request/User");

router.get("/specialists", isAuthNotRequire, async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  let userData = {
    name: "иго",
    surname: "уша",
    job: "frontEnd",
    city: "АРЗАМАС",
    skills: ["Node.js", "121212 б"],
    // expiriens: []
  };

  let users = await getSpecialList(userData);
  res.render("specialist", {
    isLoggedIn: !!user,
    id: user.userID,
    chatList: user.chatList || null,
  });
});

module.exports = router;
