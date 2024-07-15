const { Router } = require("express");
const router = Router();
let { isAuth } = require("../middlewares/auth");
let setNewExpiriens = require("../../database/Request/setExpiriens");
let { v4 } = require("uuid");
const { body, validationResult } = require("express-validator");
let { decodeAccessToken } = require("../tokens/accessToken");

router.post(
  "/set_exp",
  isAuth,
  [
    body("company")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Название компании должно быть не менее 3 символов"),
    body("typeData")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Тип данных должен быть не менее 3 символов"),
    body("special")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Специальность должна быть не менее 3 символов"),
    body("description")
      .isString()
      .isLength({ min: 3 })
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

      let { company, typeData, special, description } = req.body;
      let newExp = await setNewExpiriens(userID, {
        id: v4(),
        company,
        typeData,
        special,
        description,
      });

      if (!newExp.success) {
        return res.status(400).json({ message: newExp.message });
      }

      return res.status(201).json({ message: newExp.message, newExp });
    } catch (e) {
      console.error("Ошибка при обработке запроса:", e);
      return res
        .status(500)
        .json({ message: "Произошла ошибка, попробуйте позже" });
    }
  }
);
module.exports = router;
