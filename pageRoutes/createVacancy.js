const { Router } = require("express");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const router = Router();

router.get("/create-vacancy", async (req, res) => {
  let access = await req.cookies.access;
  let user = decodeAccessToken(access);
  console.log(user);
  res.render("createVacancy", {
    isLoggedIn: false,
    id: user.userID,
    username: "",
  });
});

module.exports = router;
