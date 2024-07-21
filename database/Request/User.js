const UserSchema = require("../../database/Schema/UserSchema");

const searchUserId = async(id) => {
    try {
        let result = await UserSchema.findOne({id})
        return result
    }
    catch(e) {
        return false
    }
}

const findUsersByFavorites = async (favorites) => {
    try {
      const personIds = favorites.map(fav => fav.person);
  
      const users = await UserSchema.find({id: personIds}).select('avatar job id name surname role'); // Предполагаем, что в вашей схеме есть поле id

      // Если id является вашим собственным полем, его не нужно преобразовывать
      const usersWithSelectedFields = users.map(user => ({
        id: user.id,
        avatar: user.avatar,
        role: user.role,
        job: user.job,
        surname: user.surname,
        name: user.name
      }));
  
      return usersWithSelectedFields;
    } catch (e) {
      console.error("Ошибка при поиске пользователей:", e);
      throw e; // или обрабатываем ошибку соответствующим образом
    }
  };
  

const searchUserEmail = async(email) => {
    try {
        let result = await UserSchema.findOne({mail:email})
        return result
    }
    catch(e) {
        return false
    }
}

module.exports = {searchUserId,searchUserEmail,findUsersByFavorites}