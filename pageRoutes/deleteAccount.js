const {Router} = require('express')
const router = Router()

router.get('/delete', (req,res) => {
    res.render('deleteProfile')
})

module.exports = router