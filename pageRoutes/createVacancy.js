const { Router } = require("express");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const router = Router();
const { isAuth } = require("../api/middlewares/auth");
router.get("/create-vacancy", isAuth, async (req, res) => {
  let access = await req.cookies.access;
  let user = decodeAccessToken(access);
  if (user.userROLE !== "creatorWork") return res.redirect("login");
    res.render("createVacancy", {
      isLoggedIn: false,
      id: user.userID,
      username: "",
    });
});

module.exports = router;
