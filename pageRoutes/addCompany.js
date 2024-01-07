const {Router} = require('express');
const router = Router()

router.get('/add-company',(req,res) => {
    res.render('addCompany', {isLoggedIn: false,username:"Igor"})
})

module.exports = router