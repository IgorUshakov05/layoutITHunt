const UserScheme = require("../../database/Schema/UserSchema");

const removeSkillsFromProfile = async (userID, skillsToRemove) => {
    try {
        let user = await UserScheme.findOne({ id: userID });
        if (!user) {
            return false;
        }

        let existingSkills = user.skills;

        // Удаляем навыки, которые присутствуют в списке для удаления
        let updatedSkills = existingSkills.filter(skill => 
            !skillsToRemove.includes(skill.title)
        );

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
module.exports = { removeSkillsFromProfile };
