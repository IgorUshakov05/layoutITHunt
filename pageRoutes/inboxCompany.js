const {Router} = require('express')
const router = Router()

router.get('/inbox/fast-work', (req,res) => {
    res.render('inboxFast-work', { isLoggedIn:false})
})

module.exports = router