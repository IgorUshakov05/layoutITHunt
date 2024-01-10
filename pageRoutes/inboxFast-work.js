const {Router} = require('express')
const router = Router()

router.get('/inbox/company', (req,res) => {
    res.render('inboxCompany', { isLoggedIn:false})
})

module.exports = router