const {Router} = require('express')
const router = Router()

router.get('/find-company', (req,res) => {
    res.render('findCompany', {isLoggedIn: false, username: ''})
})

module.exports = router