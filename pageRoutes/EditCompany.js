const {Router} = require('express')
const router = Router()

router.get('/editComapny',(req,res) => {
    res.render('EditCompany', { isLoggedIn:false})
})


module.exports = router