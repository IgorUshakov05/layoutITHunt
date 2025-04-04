const UserSchema = require("../../database/Schema/UserSchema");
const PremiumSchema = require("../../database/Schema/Premium");

const searchUserId = async (id) => {
  try {
    let result = await UserSchema.findOne({ id });
    let premium = await PremiumSchema.findOne({ userID: id });
    console.log(premium, " премиум");
    if (result) {
      return { ...result.toObject(), premium: !!premium };
    }
    return null;
  } catch (e) {
    return false;
  }
};

const searchUsersId = async (ids) => {
  try {
    // Ищем пользователей по их ID
    let result = await UserSchema.find({ id: { $in: ids } }).select(
      "surname name role job avatar id city"
    );
    return result;
  } catch (e) {
    console.error("Ошибка при поиске пользователей:", e);
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

let getSpecialList = async (data, myID, limit = 2) => {
  try {
    console.log("Начало");

    let exp = JSON.parse(JSON.stringify(data));
    function calculateExperience(expiriens) {
      return expiriens.reduce((sum, item) => {
        const experience = Number(item.date);
        return sum + (item.typeData === "m" ? experience / 12 : experience);
      }, 0);
    }
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined || value == []) {
        delete data[key];
      } else if (typeof value === "string") {
        data[key] = new RegExp(value, "i");
      } else if (Array.isArray(value)) {
        if (key === "job") {
          // Создаем массив регулярных выражений для поиска каждого значения
          data[key] = { $in: value.map((v) => new RegExp(`^${v}$`, "i")) };
        } else if (key === "skills") {
          data[key] = {
            $all: value
              .filter((v) => v?.trim?.() !== "")
              .map((v) => ({
                $elemMatch: { title: new RegExp(`^${v}$`, "i") },
              })),
          };
        } else if (key === "expiriens") {
          delete data[key];
        }
      }
    }

    const query = { role: "worker", ...data };
    console.log(query, " - запрос на mongoDB");

    let users = await UserSchema.find(query)
      .select("id name surname expiriens skills job description avatar city")
      .skip(limit - 2)
      .limit(2);
    console.log(users);

    if (users.length) {
      // Проверка на премиум-статус
      const findAllPremium = users.map((user) => user.id);
      const premium = await PremiumSchema.find({
        userID: { $in: findAllPremium },
      });
      console.log(premium);

      // Проверка на избранные
      let favorites = [];
      if (myID) {
        const me = await UserSchema.findOne({ id: myID }).select("favorite");
        if (!me) {
          console.error("Пользователь с указанным myID не найден.");
        } else {
          favorites = me.favorite || [];
          console.log("Проверка на Избранные");
          console.log(favorites, " - избранные");
        }
      }

      // Объединение премиум-статуса и избранных
      users = users.map((user) => {
        const isPremium = premium.some((prem) => prem.userID === user.id);
        const isFavorite = favorites.some((fav) => fav.person === user.id);
        return { ...user._doc, isPremium, isFavorite };
      });

      console.log(JSON.stringify(users));

      // Фильтрация по опыту
      if (exp?.expiriens) {
        users = users.filter((user) => {
          const calcExpiriens = Math.round(calculateExperience(user.expiriens));
          if (Array.isArray(exp.expiriens)) {
            if (exp.expiriens.length === 2) {
              const [min, max] = exp.expiriens;
              return (
                calcExpiriens >= min &&
                (max === undefined || calcExpiriens <= max)
              );
            } else {
              console.warn(
                "Invalid exp.expiriens array length. Expected [min, max]."
              );
              return false;
            }
          } else {
            console.warn("exp.expiriens is not an array.");
            return false;
          }
        });
      }
    }
    console.log("Конец");

    return { success: true, users };
  } catch (e) {
    console.log(e);
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
  searchUsersId,
  getSpecialList,
};
