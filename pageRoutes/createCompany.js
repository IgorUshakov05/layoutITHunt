const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken');

router.get('/create-company', async(req,res) => {
    let access = req.cookies.access
    if(!access) return res.redirect('/login')
    let decodeAccess = await decodeAccessToken(access)
console.log(decodeAccess)
    if(!decodeAccess||decodeAccess.userROLE !== 'creatorWork') return res.redirect('/')
    res.render('createCompany')
})

module.exports = router