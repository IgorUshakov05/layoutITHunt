const {Router} = require('express')
const router = Router()

router.get('/inbox/vacancies', (req,res) => {
    res.render('inboxVacansy', { isLoggedIn:false})
})

module.exports = router