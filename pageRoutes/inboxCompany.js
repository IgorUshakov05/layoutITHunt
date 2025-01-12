const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuth } = require("../api/middlewares/auth");
const { getRequest } = require("../database/Request/Company");

router.get("/inbox/company", isAuth, async (req, res) => {
  let access = await req.cookies.access;
  let user = decodeAccessToken(access);
  if (!access || !user) return res.redirect("/login");
  if (user.userROLE !== "creatorWork") return res.redirect("/inbox");
  let getInvite = await getRequest(user.userID);
  console.log(getInvite.results);
  res.render("inboxCompany", {
    isLoggedIn: !!user,
    id: user.userID,
    role: user.userROLE,
    hrList: getInvite.results || [],
    chatList: user.chatList || null,
  });
});

module.exports = router;
