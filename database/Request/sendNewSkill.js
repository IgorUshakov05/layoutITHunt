const {v4} = require('uuid')
const modelSkill = require('../Schema/userSpecial')
const newSpecial = async (data) => {
    try {
        let newSpecial = await new modelSkill({
            id: v4(),
            skill: data
        })
        let saveSpecial = await newSpecial.save()
        return true
    }
    catch(e) {
        return false
    }
}
module.exports = newSpecial