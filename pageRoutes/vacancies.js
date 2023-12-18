const {Router} = require('express');
const router = Router()

router.get('/vacancies', (req,res) => {
    res.render('vacancies', { isLoggedIn:false, username: "Igor"})
})

module.exports = router