const UserSchema = require("../../database/Schema/UserSchema");
const PremiumSchema = require("../../database/Schema/Premium");

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

let getSpecialList = async (data, myID) => {
  try {
    for (const [key, value] of Object.entries(data)) {
      if (!value === null) {
        delete data[key];
      } else if (typeof value === "string") {
        data[key] = new RegExp(`.*${value}.*`, "i");
      } else if (typeof value === "object") {
        // data[key] = {
        //   $elemMatch: {
        //     title: { $in: value.map((v) => new RegExp(`.*${v}.*`, "i")) },
        //   },
        // };
      }
    }
    let users;
    if (!data.length) {
      users = await UserSchema.aggregate([
        // Применяем фильтр по роли и любым другим полям из data
        { $match: { role: "worker", ...data } },
      ]);
    } else {
      users = await UserSchema.find({ role: "worker" });
    }
    let findAllPremium = users.map((user) => user.id);
    let premium = await PremiumSchema.find({ userID: { $in: findAllPremium } });
    users.forEach((user) => {
      user.isPremium = premium.some((prem) => prem.userID === user.id);
    });
    if (myID) {
      let me = await UserSchema.findOne({ id: myID }).select("favorite");
      if (!me) {
      } else {
        users.forEach((user) => {
          user.isFavorite = me.favorite.some(
            (userFav) => userFav.person === user.id
          );
        });
      }
    }

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
