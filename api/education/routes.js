const { Router } = require("express");
const router = Router();
let { isAuth } = require("../middlewares/auth");
let setNewEducation = require("../../database/Request/setEducation");
let delEducation = require("../../database/Request/delEducation");
let { v4 } = require("uuid");
const {
  body,
  validationResult: validationResult,
} = require("express-validator");
let { decodeAccessToken } = require("../tokens/accessToken");

router.post(
  "/del_edu",
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
      let delExp = await delEducation(userID, id);

      if (!delExp.success) {
        return res.status(400).json({ message: delExp.message });
      }

      return res
        .status(201)
        .json({ message: delExp.message, result: delExp.result });
    } catch (e) {
      console.error("Ошибка при обработке запроса:", e);
      return res
        .status(500)
        .json({ message: "Произошла ошибка, попробуйте позже" });
    }
  }
);

router.post(
  "/set_edu",
  isAuth,
  [
    body("course")
      .isString()
      .isLength({ min: 1, max: 60 })
      .withMessage("Название курса должно быть не менее 3 символов"),
    body("type")
      .isString()
      .isIn([
        "Общее образование",
        "Профессиональное образование",
        "Дополнительное образование",
        "Профессиональное обучение",
      ]) 
      .withMessage(`Общее образование, Профессиональное образование, Дополнительное образование, Профессиональное обучение`),
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

      let { course, type } = req.body;
      let newEdu = await setNewEducation(userID, {
        id: v4(),
        course,
        type,
      });

      if (!newEdu.success) {
        return res.status(400).json({ message: newEdu.message });
      }

      return res
        .status(201)
        .json({ message: newEdu.message, result: newEdu.result });
    } catch (e) {
      console.error("Ошибка при обработке запроса:", e);
      return res
        .status(500)
        .json({ message: "Произошла ошибка, попробуйте позже" });
    }
  }
);
module.exports = router;
