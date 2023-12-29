const {Router} = require('express')
const router = Router()

router.get('/SeSideHr',(req,res) => {
    res.render('SeSideHr', { isLoggedIn:false})
})


module.exports = router