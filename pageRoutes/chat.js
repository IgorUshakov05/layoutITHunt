const { Router } = require("express");
const { isAuth } = require("../api/middlewares/auth");
const { decodeAccessToken } = require("../api/tokens/accessToken");
let searchChatList = require("../database/Request/chatList");

const router = Router();

router.get("/chats/:id", isAuth, async (req, res) => {
  console.error("Вход в список чатов");
  let access = req.cookies.access;
  const chatId = req.params.id;
  console.log(chatId);

  let user = await decodeAccessToken(access);
  if (!user) {
    return await res.redirect("/login");
  }
  console.log("Проверка доступа:", user.chatList, chatId);
  console.log(user);
  let searchChats = await searchChatList(user.chatList);
  console.log(searchChats, " - чат");
  console.log(user);
  const currentUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log(currentUrl, " - текущий url");
  return await res.render("chats", {
    isLoggedIn: !!user,
    id: user.userID,
    currentUrl,
    chat: req.params.id || null,
    chats: searchChats || [],
  });
});

module.exports = router;
