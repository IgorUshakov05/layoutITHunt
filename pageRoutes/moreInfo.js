const {Router} = require('express');
const router = Router()

router.get('/add-data',(req,res) => {
    console.log(req.user)
    if(!req.user) {
        return res.redirect('/')
    }
    res.render('moredata', {isLoggedIn: false,username:"Igor"})
})

module.exports = router