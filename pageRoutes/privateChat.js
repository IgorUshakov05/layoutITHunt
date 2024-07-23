const { Router } = require("express");
const router = Router();
const { isAuth } = require("../api/middlewares/auth");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const findChat = require("../database/Request/PrivateChatSearch");
const { searchUserId } = require("../database/Request/User");
let searchChatList = require("../database/Request/chatList");

router.get("/chat/:id", isAuth, async (req, res) => {
  try {
    let access = req.cookies.access;
    let id = req.params.id;
    if (!id) return await res.redirect("/login");
    let user = await decodeAccessToken(access);
    if (!user) return await res.redirect("/login");
    let userChat = await findChat(id);
    if (!userChat) return await res.redirect("/login");
    let isAccess = await userChat.users.some(
      (user) => user.userID === user.userID
    );
    if (!isAccess) return await res.redirect("/login");
    let notMe = await userChat.users.filter(
      (item) => item.userID !== user.userID
    );
    let findUserById = await searchUserId(notMe[0].userID);
    console.log(findUserById);
    let searchChats = await searchChatList(user.chatList);
    const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log(userChat.mesages);
    res.render("userChat", {
      isLoggedIn: !!user,
      messages: userChat.mesages,
      id: user.userID,
      personUser: findUserById,
      isLoggedIn: !!user,
      currentUrl ,
      chat: user.chatList || null,
      chats: searchChats || [],
    });
  } catch (e) {
    console.log(e);
    return res.redirect("/login");
  }
});

module.exports = router;
