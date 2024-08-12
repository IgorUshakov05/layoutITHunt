const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const router = Router();

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
  "noExpencion",
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
    check("salary.min")
      .isFloat({ min: 0 })
      .withMessage("Минимальная зарплата должна быть больше или равна 0"),
    check("salary.max")
      .isFloat({ min: 0 })
      .withMessage("Максимальная зарплата должна быть больше или равна 0"),
    check("salary").custom((salary) => {
      const { min, max, agreement } = salary;
      if (agreement || min > 0 || max > 0) {
        return true;
      }
      throw new Error(
        'Зарплата должна быть либо указана, либо указано "agreement"'
      );
    }),
    check("description")
      .isLength({ min: 10 })
      .withMessage("Описание должно быть не менее 10 символов"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.status(201).json({ message: "Vacancy created successfully" });
  }
);

module.exports = router;
