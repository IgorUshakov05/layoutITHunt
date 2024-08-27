const { Router } = require("express");
const router = Router();
const { isAuth } = require("../api/middlewares/auth");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { findCourtOfUser } = require("../database/Request/Company");

router.get("/court", isAuth, async (req, res) => {
  let access = req.cookies.access;
  if (!access) res.redirect("/");
  let decodeAccess = decodeAccessToken(access);
  if (!decodeAccess) res.redirect("/");
  let findCourt = await findCourtOfUser(decodeAccess.userID);
  console.log(findCourt);
  if (!findCourt.success || !findCourt.court) res.redirect("/");
  res.render("court", { findCourt: findCourt.court });
});

module.exports = router;
