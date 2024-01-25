const {Router} = require('express')
const router = Router()

router.get('/seeSideProf',(req,res) => {
    res.render('seeSideProf.ejs', { isLoggedIn:false})
})


module.exports = router