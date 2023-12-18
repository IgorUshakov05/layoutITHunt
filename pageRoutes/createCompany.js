const {Router} = require('express')
const router = Router()

router.get('/create-company', (req,res) => {
    res.render('createCompany')
})

module.exports = router