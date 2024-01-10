const {Router} = require('express')
const router = Router()

router.get('/inbox/other', (req,res) => {
    res.render('inboxOther', { isLoggedIn:false})
})

module.exports = router