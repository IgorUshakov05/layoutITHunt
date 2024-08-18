const { Router } = require("express");
const router = Router();
const {decodeAccessToken} = require("../api/tokens/accessToken");

router.get("/add-company", (req, res) => {
  let access = req.cookies.access;
  let user = decodeAccessToken(access);
  console.log(user);
  res.render("addCompany", {
    isLoggedIn: !!user,
    id: user.userID,
    chatList: user.chatList || null,
  });
});

module.exports = router;
