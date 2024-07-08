const {Router} = require('express')
const router = Router()
const logout = require('../api/authorization/logout')

router.get('/login',async(req,res) => {
    let logoutRegresh =await logout(req)
    console.log(logoutRegresh)
    await res.clearCookie('access')
    await res.clearCookie('refresh')
    return await res.render('login')
})


module.exports = router