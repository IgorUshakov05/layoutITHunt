const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../tokens/accessToken");
const { isAuth } = require("../middlewares/auth");
let chatCreate = require('../../database/Request/PrivateChat')

router.get("/send-message", isAuth, async (req, res) => {
  let access = req.cookies.access;
  if (!access) return await res.redirect("/login");
  let decodeAccess = await decodeAccessToken(access);
  if (!decodeAccess) return await res.redirect("/login");
  let referringPage = req.headers.referer.split("/")[3];
  console.log("кто - ", decodeAccess.userID);
  console.log("кому - ", referringPage);
  let chatID = await chatCreate(decodeAccess.userID,referringPage)
  res.redirect(`/chat/${chatID}`);    
});


module.exports = router;
