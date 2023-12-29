const {Router} = require('express')
const router = Router()

router.get('/hrMe',(req,res) => {
    res.render('ImHR', { isLoggedIn:false})
})


module.exports = router