const {Router} = require('express')
const router = Router()

router.get('/profesionalMe',(req,res) => {
    res.render('ImProfessional.ejs', { isLoggedIn:false})
})


module.exports = router