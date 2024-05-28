const {Router} = require('express')
const router = Router()

router.get('/court',(req,res) => {
    res.render('court')
})

module.exports = router