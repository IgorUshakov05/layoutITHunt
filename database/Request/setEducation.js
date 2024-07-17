const UserSchema = require("../../database/Schema/UserSchema");

const setNewEducation = async (id, educationItem) => {
  try {
    const result = await UserSchema.findOneAndUpdate(
      { id },
      { $push: { education: educationItem } }
    );
    if (result.modifiedCount === 0) {
      return { success: false, message: "Пользователь не найден" };
    }
    return { success: true, message: "Успешно обновлено",result: educationItem };
  } catch (e) {
    console.error("Ошибка при обновлении опыта:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

module.exports = setNewEducation;