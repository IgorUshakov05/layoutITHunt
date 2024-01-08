const {Router} = require('express')
const router = Router()

router.get('/inbox', (req,res) => {
    res.render('inbox', { isLoggedIn:false})
})

module.exports = router