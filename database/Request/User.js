const UserSchema = require("../../database/Schema/UserSchema");

const searchUserId = async (id) => {
  try {
    let result = await UserSchema.findOne({ id });
    return result;
  } catch (e) {
    return false;
  }
};

const findUsersByFavorites = async (favorites) => {
  try {
    const personIds = favorites.map((fav) => fav.person);

    const users = await UserSchema.find({ id: personIds }).select(
      "avatar job id name surname role"
    ); // Предполагаем, что в вашей схеме есть поле id

    // Если id является вашим собственным полем, его не нужно преобразовывать
    const usersWithSelectedFields = users.map((user) => ({
      id: user.id,
      avatar: user.avatar,
      role: user.role,
      job: user.job,
      surname: user.surname,
      name: user.name,
    }));

    return usersWithSelectedFields;
  } catch (e) {
    console.error("Ошибка при поиске пользователей:", e);
    throw e; // или обрабатываем ошибку соответствующим образом
  }
};

let getSpecialList = async (data) => {
  try {
    for (const [key, value] of Object.entries(data)) {
      if (!value === null) {
        delete data[key];
      } else if (typeof value === "string") {
        data[key] = new RegExp(`.*${value}.*`, "i");
      } else if (typeof value === "object") {
        data[key] = {
          $elemMatch: {
            title: { $in: value.map((v) => new RegExp(`.*${v}.*`, "i")) },
          },
        };
      }
    }
    const users = await UserSchema.find({ role: "worker", ...data }).select(
      "avatar job id name surname role skills description city expiriens"
    );
    console.log(
      users[0].expiriens.reduce((acc, item) => {
        let month = 0;
        let year = 0;

        if (item.typeData === "m") {
          month = +Number(item.date);
          // Если месяцев больше 12, переводим в годы
          year = Math.floor(month / 12); // Конвертируем месяцы в годы
          month = month % 12; // Остаток месяцев
        } else if (item.typeData === "y") {
          year = +Number(item.date);
        }

        // Суммируем года и добавляем в аккумулятор
        return acc + year + month / 12; // Месяцы прибавляются как доля года
      }, 0)
    );
    console.log(users[0].expiriens);
    return { success: true, users };
  } catch (e) {
    console.log(e.message);
    return { success: false, message: "Ошибка при получении пользователей" };
  }
};

const searchUserEmail = async (email) => {
  try {
    let result = await UserSchema.findOne({ mail: email });
    return result;
  } catch (e) {
    return false;
  }
};

module.exports = {
  searchUserId,
  searchUserEmail,
  findUsersByFavorites,
  getSpecialList,
};
