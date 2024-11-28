const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { getSpecialList } = require("../database/Request/User");

router.get("/specialists", isAuthNotRequire, async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  let userData = {
    job: req.query?.job ? JSON.parse(req?.query?.job) : null,
    name: req.query.name || null,
    surname: req.query.surname || null,
    skills: req.query?.skills ? JSON.parse(req?.query?.skills) : null,
    city: req.query.city || null,
  };
  console.log(userData);
  let users = await getSpecialList(userData, user?.userID);
  if (!users.success) return res.render("404");
  res.render("specialist", {
    isLoggedIn: !!user,
    id: user.userID,
    users: users.users,
    chatList: user.chatList || null,
  });
});

module.exports = router;
