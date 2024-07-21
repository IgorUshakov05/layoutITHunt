const {Router} = require('express');
const { isAuth } = require("../api/middlewares/auth");
const {decodeAccessToken} = require('../api/tokens/accessToken');
let searchChatList = require('../database/Request/chatList');

const router = Router();

router.get('/chats/:id', isAuth, async(req,res) => {
    let access = req.cookies.access;
    console.log(req.params.id);
    if (!req.params.id || !access) {
        return res.redirect('/login');  // return here to stop further execution
    }
    let user = await decodeAccessToken(access);
    if(!user) {
        return res.redirect('/login')
    }
    console.log(user)
    if (user.chatList !== req.params.id) {
        return res.redirect('/login');  // return here to stop further execution
    }
    
    let searchChats = await searchChatList(user.userID);
    console.log(searchChats, ' - чат');
    console.log(user);
    return res.render('chats', { isLoggedIn: !!user, id: user.userID, chatList: user.chatList || null });
});

module.exports = router;
