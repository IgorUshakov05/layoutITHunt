const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { getSpecialList } = require("../database/Request/User");

router.get("/specialists", isAuthNotRequire, async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  let userData = {
    // job: "FrontEnd",
  };
  let users = await getSpecialList(userData, user?.userID);
  if(!users.success) return res.render("error")
  res.render("specialist", {
    isLoggedIn: !!user,
    id: user.userID,
    users: users.users,
    chatList: user.chatList || null,
  });
});

module.exports = router;
