const SkillScheme = require('../../database/Schema/Skills');
const UserScheme = require('../../database/Schema/UserSchema');

const saveSkillIntoOurBase = async (skills) => {
    try {
        if(!skills.length) {
            return false
        }
        const existingSkills = await SkillScheme.find();

        const newSkills = skills.filter((skill) => !existingSkills.some((existingSkill) => existingSkill.title === skill.title));

        let result = await SkillScheme.insertMany(newSkills);

        if (!result) {
            return false;
        }

        return result;
    } catch (e) {
        console.log(e);
        return false;
    }
};




const saveSkillInProfile = async (userID, skillsOfUser) => {
    try {
        let user = await UserScheme.findOne({ id: userID });
        if (!user) {
            return false;
        }

        let existingSkills = user.skills;

        // Фильтруем новые навыки, исключая уже существующие
        let newSkills = skillsOfUser.filter((skill) => 
            !existingSkills.some((existingSkill) => existingSkill.title === skill.title)
        );

        // Обновляем навыки пользователя, добавляя новые навыки
        let updatedSkills = [...existingSkills, ...newSkills];

        let result = await UserScheme.updateOne({ id: userID }, { skills: updatedSkills });

        if (result.nModified === 0) {
            return false;
        }

        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
};




// Экспортируем функцию для использования в других частях приложения
module.exports = {saveSkillIntoOurBase,saveSkillInProfile};

