const {Router} = require('express')
const router = Router()

router.get('/court',isAuth(req,res) => {
    res.render('court')
})

module.exports = router