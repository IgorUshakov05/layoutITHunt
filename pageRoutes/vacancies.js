const { Router } = require("express");
const router = Router();
const { query, validationResult } = require("express-validator");
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

const wayOfWorkingOptions = [
  "Удаленная",
  "Полный день",
  "Частичная работа",
  "Офисная",
  "Гибкий график",
  "Сменный график",
];

const expirienceLifeOptions = [
  "noExperience",
  "EightPlus",
  "SixEight",
  "ThreeFour",
  "OneTwo",
];
const validateQueryData = [
  // Проверка special
  query("special")
    .optional()
    .custom((value) => {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed))
        throw new Error("special должен быть массивом");
      for (let item of parsed) {
        if (!specialList.includes(item)) {
          throw new Error(`special содержит недопустимое значение: ${item}`);
        }
      }
      return true;
    }),

  // Проверка typeWork
  query("typeWork")
    .optional()
    .custom((value) => {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed))
        throw new Error("typeWork должен быть массивом");
      for (let item of parsed) {
        if (!wayOfWorkingOptions.includes(item)) {
          throw new Error(`typeWork содержит недопустимое значение: ${item}`);
        }
      }
      return true;
    }),

  // Проверка skills (допустим, без списка допустимых значений, т.к. он не указан)
  query("skills")
    .optional()
    .custom((value) => {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed))
        throw new Error("skills должен быть массивом");
      return true;
    }),

  // Проверка experience
  query("experience")
    .optional()
    .custom((value) => {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed))
        throw new Error("experience должен быть массивом");
      for (let item of parsed) {
        if (!expirienceLifeOptions.includes(item)) {
          throw new Error(`experience содержит недопустимое значение: ${item}`);
        }
      }
      return true;
    }),

  // Проверка цены
  query("price_min")
    .optional()
    .isNumeric()
    .withMessage("price_min должен быть числом"),
  query("price_max")
    .optional()
    .isNumeric()
    .withMessage("price_max должен быть числом"),
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
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { getVacancy } = require("../database/Request/Vacancy");
router.get(
  "/vacancies",
  validateQueryData,
  isAuthNotRequire,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect('/404');
    }

    let data = {
      special: stringToJson(req.query.special)
        ? { $in: stringToJson(req.query.special) }
        : null,
      typeWork: stringToJson(req.query.typeWork)
        ? {
            $in: stringToJson(req.query.typeWork).map((type) => ({
              title: type,
            })),
          }
        : null,
      skills: stringToJson(req.query.skills)
        ? {
            $all: stringToJson(req.query.skills).map((skill) => ({
              title: skill,
            })),
          }
        : null,
      // city: stringToJson(req.query.city),
      experience: stringToJson(req.query.experience)
        ? { $in: stringToJson(req.query.experience) }
        : null,
      "price.minPrice": stringToJson(req.query.price_min)
        ? { $gte: stringToJson(req.query.price_min) }
        : null,
      "price.maxPrice": stringToJson(req.query.price_max)
        ? { $lte: stringToJson(req.query.price_max) }
        : null,
    };
    for (let [key, value] of Object.entries(data)) {
      if (!data[key]) delete data[key];
    }
    console.log(data);
    let access = req.cookies.access;
    let user = decodeAccessToken(access);
    console.log(user);
    let vacancies = await getVacancy(data, 2, user.userID);
    if (!vacancies.success) {
      return res.redirect("/404");
    }
    return res.render("vacancies", {
      isLoggedIn: !!user,
      vacancies: vacancies.vacancies,
      premium:vacancies.premium, 
      users: vacancies.users,
      company: vacancies.company,
      id: user.userID,
      favorites: vacancies.favorites,
      chatList: user.chatList || null,
    });
  }
);

module.exports = router;
