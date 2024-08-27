const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");

router.get("/create-fast-work", async (req, res) => {
  let access = await req.cookies.access;
  let user = decodeAccessToken(access);
  res.render("createFastWork", {
    isLoggedIn: false,
    id: user.userID,
    username: "",
  });
});

module.exports = router;
