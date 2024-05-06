const {Router} = require('express');
const router = Router()

router.get('/chat-company', (req,res) => {
    res.render('companyChat', { isLoggedIn:false, username: "Igor"})
})

module.exports = router