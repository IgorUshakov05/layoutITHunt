const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const router = Router();
const { decodeAccessToken } = require("../tokens/accessToken");
const {
  createVacancy,
  updateVacansy,
  sendRequest,
  removeVacancy,
} = require("../../database/Request/Vacancy");
const { removeFastWork } = require("../../database/Request/FastWork");
const { electedVacancy } = require("../../database/Request/FavoriteVacancy");
const { searchUserId } = require("../../database/Request/User");
const { searchVacancyById } = require("../../database/Request/Vacancy");
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
router.post(
  "/removePublication",
  [
    check("id").isString(),
    check("text").isInt({ min: 1, max: 3 }),
    check("type")
      .isIn(["vacancy", "fastwork"])
      .withMessage("Неизвестный тип публикации"),
  ],
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
      }
      let id = req.body.id;
      let text = req.body.text;
      console.log(id, text);
      let access = req.cookies.access;
      if (!access) return res.redirect("/login");
      let removePublication;
      let type = req.body.type;
      switch (type) {
        case "vacancy":
          removePublication = await removeVacancy(id, text);
          break;
        case "fastwork":
          removePublication = await removeFastWork(id, text);
          break;
        default:
          removePublication = { success: false, error: "Не верный тип" };
          break;
      }
      console.log(removePublication, " - удаление публикации");
      if (!removePublication.success) {
        return res
          .status(400)
          .json({ success: false, error: removePublication.message });
      }
      return res
        .status(200)
        .json({ success: true, message: "Vacancy deleted successfully" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
    }
  }
);
router.post("/favorite-vacancy", async (req, res) => {
  try {
    let access = await req.cookies.access;
    if (!access) return res.redirect("/login");
    const decodeAccess = await decodeAccessToken(access);
    if (!decodeAccess) return res.redirect("/login");
    let vacancyID = req.body.vacancyId;
    if (!vacancyID)
      return res.status(400).json({ message: "Id не указан", result: false });
    let findVacancyInDatabase = await searchVacancyById(vacancyID);
    console.log(findVacancyInDatabase);
    if (!findVacancyInDatabase.success)
      return res
        .status(400)
        .json({ message: "Вакансия не найдена", result: false });
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

router.post(
  "/edit-vacancy",
  [
    check("id").notEmpty(),
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
      const vacancyID = req.body.id;
      console.log(vacancyID, " - id вакансии");
      const decodeAccess = await decodeAccessToken(access);
      if (!decodeAccess || !vacancyID) return res.redirect("/login");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
      let findUser = await searchUserId(decodeAccess.userID);
      if (!findUser) return res.redirect("/login");
      const result = await updateVacansy(vacancyID, {
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
      if (!result.success)
        return res
          .status(501)
          .json({ success: false, message: result.message });
      return res.status(201).json({
        message: "Vacancy created successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post(
  "/respond-vacancy",
  [
    check("id").notEmpty().isUUID(),
    check("message")
      .notEmpty()
      .isLength({ min: 1, max: 1500 })
      .withMessage("Сообщение не больше 1500 символов"),
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
      if (!findUser || findUser.role !== "worker")
        return res.redirect("/login");
      const vacancyID = req.body.id;
      let send = await sendRequest(
        vacancyID,
        decodeAccess.userID,
        req.body.message
      );
      console.log(send);
      return res.status(200).json(send);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Программист накосячил(" });
    }
  }
);

module.exports = router;
