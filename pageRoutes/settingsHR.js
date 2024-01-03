const {Router} = require('express');
const router = Router()

router.get('/settingHR', (req,res) => {
    res.render('settingsHR', { isLoggedIn:false})
})

module.exports = router