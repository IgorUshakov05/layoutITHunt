const {Router} = require('express')
const router = Router()

router.get('/registration',(req,res) => {
    res.render('registration')
})


module.exports = router