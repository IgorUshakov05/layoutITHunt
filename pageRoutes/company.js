const {Router} = require('express')
const router = Router()

router.get('/company', (req,res) => {
    res.render('company', { isLoggedIn:false})
})

module.exports = router