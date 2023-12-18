const {Router} = require('express')
const router = Router()

router.get('/',(req,res) => {
    res.render('index', { isLoggedIn:false})
})


module.exports = router