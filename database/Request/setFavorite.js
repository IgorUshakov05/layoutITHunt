const UserSchema = require("../../database/Schema/UserSchema");

const setFavorite = async (Myid, idUser) => {
  try {
    let findUser = await UserSchema.findOne({ id: idUser });
    let Hr = await UserSchema.findOne({ id: Myid });
    if (!findUser || !Hr) {
      return { success: false, message: "Пользователь не найден" };
    }

    // Проверяем, есть ли уже idUser в массиве favorite у Hr
    const isFavorite = Hr.favorite.some(item => item.person === idUser);

    let result;
    if (isFavorite) {
      // Удаляем idUser из массива favorite
      result = await UserSchema.findOneAndUpdate(
        { id: Myid },
        { $pull: { favorite: { person: idUser } } },
        { new: true }
      );
      if (!result) return { success: false, message: "Ошибка удаления" };
      return { success: true, message: "Удалено из избранного", result: false };
    } else {
      // Добавляем idUser в массив favorite
      result = await UserSchema.findOneAndUpdate(
        { id: Myid },
        { $push: { favorite: { person: idUser } } },
        { new: true }
      );
      if (!result) return { success: false, message: "Ошибка добавления" };
      return { success: true, message: "Добавлено в избранное", result: true };
    }
  } catch (e) {
    console.error("Ошибка при работе с избранным:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

module.exports = setFavorite;
