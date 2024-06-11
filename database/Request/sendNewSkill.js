const {v4} = require('uuid')
const modelSkill = require('../Schema/skillOfUser')
const newSkill = async (data) => {
    try {
        let newSkill = await new modelSkill({
            id: v4(),
            skill: data
        })
        let saveSkill = await newSkill.save()
        return true
    }
    catch(e) {
        return false
    }
}
newSkill('Abakan')
module.exports = newSkill