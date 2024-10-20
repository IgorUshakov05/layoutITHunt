const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const router = Router();
const { decodeAccessToken } = require("../tokens/accessToken");
const { electedFastWork } = require("../../database/Request/FavoriteFastWork");
const { searchUserId } = require("../../database/Request/User");
const {
  searchFastWorkById,
  createFastWork,
  updateFastWork,
  sendRequest
} = require("../../database/Request/FastWork");
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

const expirienceLifeOptions = [
  1,
  2,
  3,
  4,
  5,
];

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
      console.log(findUser, ' пользователь');
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
      console.log(err)
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
    check('id').notEmpty(),
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
      const result = await updateFastWork(id,{
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
      console.log(send);
      return res.status(200).json(send);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Программист накосячил(" });
    }
  }
);

module.exports = router;
