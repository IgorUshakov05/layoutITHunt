const {Router} = require('express');
const router = Router()

router.get('/setting', (req,res) => {
    res.render('settingsProfile', { isLoggedIn:false})
})

module.exports = router