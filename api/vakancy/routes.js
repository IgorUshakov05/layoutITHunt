const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const router = Router();
const { decodeAccessToken } = require("../tokens/accessToken");
const { createVacancy } = require("../../database/Request/Vacancy");
const {
  electedVacancy,
} = require("../../database/Request/FavoriteVacancy");
const { searchUserId } = require("../../database/Request/User");
const { searchVacancyById } = require('../../database/Request/Vacancy')
const specialList = [
  "Аналитик",
  "SEO-специалист",
  "Графический дизайнер",
  "Системный администратор",
  "Администратор БД",
  "HR",
  "FrontEnd",
  "Менеджер продаж",
  "Тестировщик",
  "Продукт менеджер",
  "BackEnd",
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

router.post(
  "/create-vacancy",
  [
    check("special").isIn(specialList).withMessage("Неверная специальность"),
    check("skills")
      .isArray({ min: 1 })
      .withMessage("Должен быть хотя бы один навык"),
    check("wayOfWorking")
      .isArray()
      .custom((value) =>
        value.every((item) => wayOfWorkingOptions.includes(item))
      )
      .withMessage("Неверный способ работы"),
    check("expirienceLife")
      .isIn(expirienceLifeOptions)
      .withMessage("Неверный опыт работы"),
    check("salary.min").optional(),
    check("salary.max").optional(),
    check("salary").custom((salary) => {
      const { min, max, agreement } = salary;
      const minValue = min === "" ? 0 : min;
      const maxValue = max === "" ? 0 : max;
      if (minValue > 0 || maxValue > 0 || agreement) {
        return true;
      }
      throw new Error(
        'Необходимо указать либо "min", либо "max", либо "agreement".'
      );
    }),
    check("description")
      .isLength({ min: 10 })
      .withMessage("Описание должно быть не менее 10 символов"),
  ],
  async (req, res) => {
    try {
      let access = await req.cookies.access;
      if (!access) return res.redirect("/login");
      const decodeAccess = await decodeAccessToken(access);
      if (!decodeAccess) return res.redirect("/login");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
      let findUser = await searchUserId(decodeAccess.userID);
      console.log(findUser);
      console.log(req.body);
      if (!findUser) return res.redirect("/login");
      const result = await createVacancy({
        userID: decodeAccess.userID,
        special: req.body.special,
        skills: req.body.skills, // ['React']
        typeWork: req.body.wayOfWorking, // ['Гибкий график']
        experience: req.body.expirienceLife, // 'OneTwo'
        price: {
          minPrice: req.body.salary.min,
          maxPrice: req.body.salary.max,
          agreement: req.body.salary.agreement,
        },
        description: req.body.description, // '<h1>Awdaawdawdawd</h1>'
      });

      console.log(result);
      if (result.success) {
        res.status(201).json({
          message: "Vacancy created successfully",
          vacancy: result.data,
        });
      } else {
        res.status(500).json({ message: result.error });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post("/favorite-vacancy", async (req, res) => {
  try {
    let access = await req.cookies.access;
    if (!access) return res.redirect("/login");
    const decodeAccess = await decodeAccessToken(access);
    if (!decodeAccess) return res.redirect("/login");
    let vacancyID = req.body.id;
    if (!vacancyID)
      return res.status(400).json({ message: "Вакансия не найдена",result: false });
    let findVacancyInDatabase = await searchVacancyById(vacancyID);
    console.log(findVacancyInDatabase);
    if(!findVacancyInDatabase.success) return res.status(400).json({ message: "Вакансия не найдена", result: false });
    let addVacancyOrDelete = await electedVacancy(
      decodeAccess.userID,
      vacancyID
    );
    return res
      .status(200)
      .json({ message: "Успех!", result: addVacancyOrDelete.isNew });
  } catch (err) {
    res.status(500).json({ message: err.message, result: false });
  }
});

module.exports = router;
