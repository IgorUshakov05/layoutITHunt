const UserSchema = require("../../database/Schema/UserSchema");

const setNewExpiriens = async (id, expiriensId) => {
  try {
    const result = await UserSchema.updateOne(
      { id },
      { $pull: { expiriens: { id: expiriensId } } }
    );
    if (result.modifiedCount === 0) {
      return { success: false, message: "Опыт не найден" };
    }
    return { success: true, message: "Успешно удалено",result: expiriensId };
  } catch (e) {
    console.error("Ошибка при удалении опыта:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

module.exports = setNewExpiriens;