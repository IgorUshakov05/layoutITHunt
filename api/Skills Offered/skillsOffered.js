const {Router} = require('express')
const router = Router()
const createSkillToDataBase = require('../../database/Request/sendNewSkill')

router.post('/skillsOffered',async(req,res) => {
    let {skill} = req.body
    if(!skill.trim()) {
        return res.status(401).json({message: "Введите текст"})
    }
    let createUser = await createSkillToDataBase(skill)
    if(!createUser) {
        return res.status(401).json({message: "Такая заявка существует"})
    }
    res.status(201).json({message: "Заявка отправлена"})
})

module.exports = router