const {Router} = require('express')
const router = Router()

router.get('/create-vacancy', (req,res) => {
    res.render('createVacancy', {isLoggedIn: false, username: ''})
})

module.exports = router