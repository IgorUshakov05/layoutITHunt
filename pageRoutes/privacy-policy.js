const {Router } = require('express')
let router = Router()

router.get('/privacy-policy', (req,res) => {
    res.render('privacy-policy')
})

module.exports = router