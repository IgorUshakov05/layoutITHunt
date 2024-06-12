const {Router} = require('express')
const router = Router()
const createNewSpecial = require('../../database/Request/sendNewSkill')

router.post('/specialOffered',async(req,res) => {
    let {special} = req.body
    if(!special.trim()) {
        return res.status(401).json({message: "Введите текст"})
    }
    let createUser = await createNewSpecial(special)
    if(!createUser) {
        return res.status(401).json({message: "Такая заявка существует"})
    }
    res.status(201).json({message: "Заявка отправлена"})
})

module.exports = router