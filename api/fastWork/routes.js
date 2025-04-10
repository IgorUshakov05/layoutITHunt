const { Router } = require("express");
const router = Router();
const { check, validationResult, body } = require("express-validator");
const { decodeAccessToken } = require("../tokens/accessToken");
const { electedFastWork } = require("../../database/Request/FavoriteFastWork");
const { searchUserId } = require("../../database/Request/User");
const {
  searchFastWorkById,
  createFastWork,
  updateFastWork,
  sendRequest,
  getFastWorks,
} = require("../../database/Request/FastWork");
const { getUserEndpoint } = require("../../database/Request/WebPush");
const sendPush = require("../web-push/push");
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

const expirienceLifeOptions = [1, 2, 3, 4, 5];

router.post(
  "/create-fastwork",
  [
    check("special").isIn(specialList).withMessage("Неверная специальность"),
    check("skills")
      .isArray({ min: 1 })
      .withMessage("Должен быть хотя бы один навык"),
    check("expirienceLife")
      .isIn(expirienceLifeOptions)
      .withMessage("Неверная сложность работы"),
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
      console.log(findUser, " пользователь");
      console.log(req.body);
      if (!findUser) return res.redirect("/login");
      const result = await createFastWork({
        userID: decodeAccess.userID,
        special: req.body.special,
        skills: req.body.skills, // ['React']
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
          message: "FastWork created successfully",
          vacancy: result.data,
        });
      } else {
        res.status(500).json({ message: result.error });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
);

router.post("/favorite-fastWork", async (req, res) => {
  try {
    let access = await req.cookies.access;
    if (!access) return res.redirect("/login");
    const decodeAccess = await decodeAccessToken(access);
    if (!decodeAccess) return res.redirect("/login");
    let fastWorkID = req.body.id;
    console.log(fastWorkID);
    if (!fastWorkID)
      return res
        .status(400)
        .json({ message: "Фаст Ворк не найден", result: false });
    let findFastWorkInDatabase = await searchFastWorkById(fastWorkID);
    if (!findFastWorkInDatabase.success)
      return res
        .status(400)
        .json({ message: "Фаст Ворк не найден", result: false });
    let addFastWorkOrDelete = await electedFastWork(
      decodeAccess.userID,
      fastWorkID
    );
    return res
      .status(200)
      .json({ message: "Успех!", result: addFastWorkOrDelete.isNew });
  } catch (err) {
    res.status(500).json({ message: err.message, result: false });
  }
});

router.post(
  "/edit-fastwork",
  [
    check("id").notEmpty(),
    check("special").isIn(specialList).withMessage("Неверная специальность"),
    check("skills")
      .isArray({ min: 1 })
      .withMessage("Должен быть хотя бы один навык"),
    check("expirienceLife")
      .isIn(expirienceLifeOptions)
      .withMessage("Неверная сложность работы"),
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
      console.log(findUser, " пользователь");
      console.log(req.body);
      let id = req.body.id;
      if (!findUser || !id) return res.redirect("/login");
      const result = await updateFastWork(id, {
        userID: decodeAccess.userID,
        special: req.body.special,
        skills: req.body.skills, // ['React']
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
          message: "FastWork created successfully",
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
  "/respond-fast-work",
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
      console.log(send, " отклик");
      if (!send.success) return res.status(400).json(send);
      const payload = {
        title: `Новый отклик на фаст-ворк: ${send.data.special}`,
        body: "Кандидат заинтересовался вашим фаст-ворком и отправил отклик. Проверьте заявку в уведомлениях.",
      };
      console.log(send.data.userID)
      let endpoints = await getUserEndpoint(send.data.userID);
      if (!endpoints.success) return res.status(201).json(send);
      await sendPush(endpoints.data.subscriptions, payload);
      return res.status(201).json(send);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Программист накосячил(" });
    }
  }
);

const validateData = [
  body("price.minPrice")
    .optional()
    .isNumeric()
    .withMessage("Минимальная цена должна быть числом"),
  body("price.maxPrice")
    .optional()
    .isNumeric()
    .withMessage("Максимальная цена должна быть числом"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Навыки должны быть массивом строк")
    .bail()
    .custom((skills) => skills.every((skill) => typeof skill === "string"))
    .withMessage("Все навыки в массиве должны быть строками"),

  body("special")
    .optional()
    .isArray()
    .withMessage("Специализации должны быть массивом строк")
    .bail()
    .custom((specials) =>
      specials.every((special) => specialList.includes(special))
    )
    .withMessage("Недопустимое значение в специальностях"),
  body("hard")
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage("Уровень сложности должен быть числом от 0 до 5")
    .bail(),
];
let stringToJson = (data) => {
  try {
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    return null;
  }
};

router.post("/fast-work", validateData, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    console.log(req.body);
    let data = {
      special:
        req.body.special &&
        Array.isArray(req.body.special) &&
        req.body.special.length
          ? { $in: req.body.special }
          : null,

      level:
        req.body.hard && !isNaN(Number(req.body.hard))
          ? { $lte: Number(req.body.hard) }
          : null,

      skills:
        req.body.skills &&
        Array.isArray(req.body.skills) &&
        req.body.skills.length
          ? {
              $all: req.body.skills.map((skill) => ({
                title: skill,
              })),
            }
          : null,

      "price.minPrice":
        req.body.price_min && !isNaN(Number(req.body.price_min))
          ? { $gte: Number(req.body.price_min) }
          : null,

      "price.maxPrice":
        req.body.price_max && !isNaN(Number(req.body.price_max))
          ? { $lte: Number(req.body.price_max) }
          : null,
    };

    for (let [key, value] of Object.entries(data)) {
      if (!data[key]) delete data[key];
    }
    console.log(data);
    let access = req.cookies.access;
    let user = decodeAccessToken(access);
    let fastWorks = await getFastWorks(data, req.query.limit, user.userID);
    console.log(fastWorks.dateTimeServer);
    return res.json({
      ...fastWorks,
      limit: req.query.limit,
    });
  } catch (e) {
    console.log(e);
    return { success: false, error: "Ошибка сервера" };
  }
});

module.exports = router;
