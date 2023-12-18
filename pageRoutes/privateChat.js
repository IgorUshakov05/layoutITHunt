const {Router} = require('express');
const router = Router()

router.get('/person', (req,res) => {
    res.render('userChat', { isLoggedIn:false, username: "Igor"})
})

module.exports = router