const { Router } = require("express");
const router = Router();
let { isAuth } = require("../middlewares/auth");
let setNewExpiriens = require("../../database/Request/setExpiriens");
let delNewExpiriens = require("../../database/Request/delExpiriens");
let { v4 } = require("uuid");
const {
  body,
  validationResult: validationResult,
} = require("express-validator");
let { decodeAccessToken } = require("../tokens/accessToken");

router.post(
  "/del_exp",
  isAuth,
  [
    body("id")
      .isString()
      .isLength({ min: 1, max: 100 })
      .withMessage("Не верный ID"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { userID, userROLE } = await decodeAccessToken(req.cookies.access);
      if (userROLE !== "worker") {
        return res.status(401).json({ message: "Недостаточно прав" });
      }

      let { id } = req.body;
      let newExp = await delNewExpiriens(userID, id);

      if (!newExp.success) {
        return res.status(400).json({ message: newExp.message });
      }

      return res.status(201).json({ message: newExp.message, result:newExp.result });
    } catch (e) {
      console.error("Ошибка при обработке запроса:", e);
      return res
        .status(500)
        .json({ message: "Произошла ошибка, попробуйте позже" });
    }
  }
);

router.post(
  "/set_exp",
  isAuth,
  [
    body("company")
      .isString()
      .isLength({ min: 1, max: 60 })
      .withMessage("Название компании должно быть не менее 3 символов"),
    body("typeData")
      .isString()
      .isLength({ min: 1, max: 1 }) // Проверяем, что длина равна 1 символу
      .isIn(["m", "y"]) // Проверяем, что значение либо "d", либо "y"
      .withMessage('Тип данных должен быть "d" или "y"'),
    body("special")
      .isString()
      .isLength({ min: 1, max: 60 })
      .withMessage("Специальность должна быть не менее 3 символов"),
      body("date")
      .isString()
      .isLength({ min: 1, max: 2 })
      .withMessage("Специальность должна быть не менее 3 символов"),
    body("description")
      .isString()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Описание должно быть не менее 3 символов"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { userID, userROLE } = await decodeAccessToken(req.cookies.access);
      if (userROLE !== "worker") {
        return res.status(401).json({ message: "Недостаточно прав" });
      }

      let { company, typeData, special, description,date } = req.body;
      let newExp = await setNewExpiriens(userID, {
        id: v4(),
        company,
        typeData,
        special,
        description,
        date
      });

      if (!newExp.success) {
        return res.status(400).json({ message: newExp.message });
      }

      return res.status(201).json({ message: newExp.message, result:newExp.result });
    } catch (e) {
      console.error("Ошибка при обработке запроса:", e);
      return res
        .status(500)
        .json({ message: "Произошла ошибка, попробуйте позже" });
    }
  }
);
module.exports = router;
