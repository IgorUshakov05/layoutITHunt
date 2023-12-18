const {Router} = require('express');
const router = Router()

router.get('/specialists', (req,res) => {
    res.render('specialist', { isLoggedIn:false, username: "Igor"})
})

module.exports = router