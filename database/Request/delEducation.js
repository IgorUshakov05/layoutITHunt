const UserSchema = require("../../database/Schema/UserSchema");

const delExpiriens = async (id, educationID) => {
  try {
    const result = await UserSchema.updateOne(
      { id },
      { $pull: { education: { id: educationID } } }
    );
    if (result.modifiedCount === 0) {
      return { success: false, message: "Образование не найдено" };
    }
    return { success: true, message: "Успешно удалено",result: educationID };
  } catch (e) {
    console.error("Ошибка при удалении опыта:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

module.exports = delExpiriens;