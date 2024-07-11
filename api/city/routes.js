const {Router} = require('express');
const router = Router()
const getCity = require('./getCityOfName')
router.post('/areas', async(req,res) => {
    let city = req.body.city
    console.log(city)
    if(!city) {
        return res.status(404).json({message:"Ничего не найдено"})
    }
    let result =await getCity(city)
    if(!result) {
        return res.status(404).json({message:"Ничего не найдено"})
    }
    return res.status(200).json({path:result})

})

module.exports = router