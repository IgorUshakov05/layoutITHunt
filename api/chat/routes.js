const { Router } = require("express");
const router = Router();
const { validate } = require("uuid");
const { decodeAccessToken } = require("../tokens/accessToken");
const { isAuth } = require("../middlewares/auth");
let chatCreate = require("../../database/Request/PrivateChat");

router.get("/send-message", isAuth, async (req, res) => {
  let access = req.cookies.access;
  if (!access) return await res.redirect("/login");
  let decodeAccess = await decodeAccessToken(access);
  if (!decodeAccess) return await res.redirect("/login");
  let referringPage = req.headers.referer.split("/")[3];
  console.log("кто - ", decodeAccess.userID);
  console.log(req.query.id);
  if (!validate(referringPage)) referringPage = req.query.id;
  console.log("кому - ", referringPage || req.query.id);
  let chatID = await chatCreate(
    decodeAccess.userID,
    referringPage || req.query.id
  );
  console.log(chatID);
  if (!chatID.success) return res.redirect("/404");
  res.redirect(`/chat/${chatID.id}`);
});

module.exports = router;
