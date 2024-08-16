const {Router} = require('express')
let { isAuth } = require("../middlewares/auth");
let setFavorite = require("../../database/Request/setFavorite");
let { decodeAccessToken } = require("../tokens/accessToken");
const router = Router()

router.post('/favorite', isAuth, async (req,res) => {
    const { userID } = await decodeAccessToken(req.cookies.access);
    
    console.log(req.headers.referer)
    const id = await req.body.id ||req.headers.referer.split('/')[3];
    console.log(id,userID)
    if(!id) {
        return res.json({error:"Не верный параметр"})
    }
    let saveFavoriteUser = await setFavorite(userID, id, Boolean(req.body.id))
    if(saveFavoriteUser.success !== true) {
        return res.json({error:"Ошибка сервера"})
    }
    await res.json({result: saveFavoriteUser.result})
})

module.exports = router