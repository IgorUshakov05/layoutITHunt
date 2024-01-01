const {Router} = require('express');
const router = Router()

router.get('/settingsSpecialist', (req,res) => {
    res.render('settingsSpecialist', { isLoggedIn:false})
})

module.exports = router