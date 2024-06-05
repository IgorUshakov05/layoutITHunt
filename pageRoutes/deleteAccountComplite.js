const {Router} = require('express')
const router = Router()

router.get('/confirm', (req,res) => {
    res.render('deleteComplite')
})

module.exports = router