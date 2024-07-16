const UserSchema = require("../../database/Schema/UserSchema");

const setNewExpiriens = async (id, expiriensItem) => {
  try {
    const result = await UserSchema.findOneAndUpdate(
      { id },
      { $push: { expiriens: expiriensItem } }
    );
    if (result.modifiedCount === 0) {
      return { success: false, message: "Пользователь не найден" };
    }
    return { success: true, message: "Успешно обновлено",result: expiriensItem };
  } catch (e) {
    console.error("Ошибка при обновлении опыта:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

module.exports = setNewExpiriens;