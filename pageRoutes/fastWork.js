const { Router } = require("express");
const router = Router();
const { query, validationResult } = require("express-validator");
const { getFastWorks } = require("../database/Request/FastWork");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const specialList = [
  "Аналитик",
  "SEO-специалист",
  "Графический дизайнер",
  "Системный администратор",
  "Администратор БД",
  "HR",
  "Frontend",
  "Менеджер продаж",
  "Тестировщик",
  "Продукт менеджер",
  "Backend",
  "FullStack",
  "TeamLeader",
  "Верстальщик",
  "Инфобез-специалист",
  "Веб-дизайнер",
  "Маркетолог",
  "Копирайтер",
];
let stringToJson = (data) => {
  try {
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
router.get("/fast-work", isAuthNotRequire, async (req, res) => {
  console.log(req.query);
  let data = {
    special: stringToJson(req.query.special)
      ? { $in: stringToJson(req.query.special) }
      : null,

    // Обработка поля hard
    level: stringToJson(req.query.hard)
      ? isNaN(Number(stringToJson(req.query.hard)))
        ? null
        : { $lte: Number(stringToJson(req.query.hard)) } // если значение можно привести к числу
      : null,

    skills: stringToJson(req.query.skills)
      ? {
          $all: stringToJson(req.query.skills).map((skill) => ({
            title: skill,
          })),
        }
      : null,

    // Обработка цен
    "price.minPrice": stringToJson(req.query.price_min)
      ? { $gte: Number(stringToJson(req.query.price_min)) } // Преобразование в число
      : null,

    "price.maxPrice": stringToJson(req.query.price_max)
      ? { $lte: Number(stringToJson(req.query.price_max)) } // Преобразование в число
      : null,
  };

  for (let [key, value] of Object.entries(data)) {
    if (!data[key]) delete data[key];
  }
  console.log(data);
  let access = req.cookies.access;
  let user = decodeAccessToken(access);
  console.log(user);
  let fastWorksFromDataBase = await getFastWorks(data, 2, user.userID);
  if (!fastWorksFromDataBase.success) {
    return res.redirect("/404");
  }
  res.render("fast-work", {
    isLoggedIn: !!user,
    fastWorks: fastWorksFromDataBase.fastWorks,
    users: fastWorksFromDataBase.users,
    company: fastWorksFromDataBase.company,
    id: user.userID,
    favorites: fastWorksFromDataBase.favorites,
    chatList: user.chatList || null,
  });
});

module.exports = router;
