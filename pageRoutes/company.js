const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { query, validationResult } = require("express-validator");
const { findFAllFavoriteOfId } = require("../database/Request/FavoriteVacancy");
const {
  findCompanyOfINN,
  getVacansyByCompanyINN,
} = require("../database/Request/Company");
const { getVacancy } = require("../database/Request/Vacancy");
const { getFastWorks } = require("../database/Request/FastWork");

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

  // Что ищем
  query("find") // Проверяем параметр 'find' в query string
    .optional() // Параметр необязателен
    .isIn(["Вакансии", "Фаст-Ворк"]) // Значение должно быть либо "Вакансии", либо "Фаст-Ворк"
    .withMessage(
      "Параметр 'find' должен быть равен 'Вакансии' или 'Фаст-Ворк'"
    ), // Сообщение об ошибке
  // Проверка skills (допустим, без списка допустимых значений, т.к. он не указан)
  query("skills")
    .optional()
    .custom((value) => {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed))
        throw new Error("skills должен быть массивом");
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

router.get(
  "/company/:id",
  isAuthNotRequire,
  validateQueryData,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect("/404");
    }
    let data = {
      special: stringToJson(req.query.special)
        ? { $in: stringToJson(req.query.special) }
        : null,
      skills: stringToJson(req.query.skills)
        ? {
            $all: stringToJson(req.query.skills).map((skill) => ({
              title: skill,
            })),
          }
        : null,
      "price.minPrice": stringToJson(req.query.price_min)
        ? { $gte: stringToJson(req.query.price_min) }
        : null,
      "price.maxPrice": stringToJson(req.query.price_max)
        ? { $lte: stringToJson(req.query.price_max) }
        : null,
    };
    console.log({ ...data, find: req.query.find });
    for (let [key, value] of Object.entries(data)) {
      if (!data[key]) delete data[key];
    }
    let access = await req.cookies.access;
    let user = await decodeAccessToken(access);
    let companyId = req.params.id;
    if (!companyId) return res.redirect("/");
    let findAllFV = [];
    if (user) {
      findAllFV = await findFAllFavoriteOfId(user.userID);
    }
    let company = await findCompanyOfINN(companyId, user.userID);
    if (!company.success) return res.redirect("/404");
    
    let publication = await getVacansyByCompanyINN(companyId);
    await res.render("company", {
      isLoggedIn: !!user,
      id: user.userID,
      publication,
      myFavorites: findAllFV.data,
      isCreator: user ? user.userID === company.data.creatorID : false,
      isEmployee: company?.data?.userList.some(
        (item) => item.userID === user.userID
      ),
      chatList: user.chatList || null,
      company: company.data,
    });
  }
);

module.exports = router;
