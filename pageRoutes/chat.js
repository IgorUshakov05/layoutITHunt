const { Router } = require("express");
const { isAuth } = require("../api/middlewares/auth");
const { decodeAccessToken } = require("../api/tokens/accessToken");
let searchChatList = require("../database/Request/chatList");

const router = Router();

router.get("/chats/:id", isAuth, async (req, res) => {
  let access = req.cookies.access;
  console.log(req.params.id);
 
  let user = await decodeAccessToken(access);
  if (!user) {
    return await res.redirect("/login");
  }
  console.log(user);
  if (user.chatList !== req.params.id) {
    return await res.redirect("/login"); // return here to stop further execution
  }

  let searchChats = await searchChatList(user.chatList);
  console.log(searchChats, " - чат");
  console.log(user);
  const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  return await res.render("chats", {
    isLoggedIn: !!user,
    id: user.userID,
    currentUrl,
    chat: req.params.id || null,
    chats: searchChats || [],
  });
});

module.exports = router;
