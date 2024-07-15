const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../tokens/accessToken");
const { updateInfoUser } = require("./Request/updateUserInfo");
const { isAuth } = require("../middlewares/auth");
const { body, validationResult } = require("express-validator");

router.post(
  "/setSettings",
  body('surname').isLength({ min: 2 }).optional(),
  body('name').isLength({ min: 2 }).optional(),
  body("birthDay")
    .optional()
    .isDate({ format: "DD-MM-YYYY" }) // Валидация даты в первую очередь
    .withMessage("Введенное значение не является датой.")
    .custom((value) => {
      if (value === undefined || value === "") {
        return true; // Пропускаем валидацию, если значение пустое
      } else {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return Promise.reject("Введенное значение не является датой.");
        }
        return date < new Date();
      }
    })
    .withMessage("Дата рождения должна быть меньше текущей."),
  isAuth, // Middleware для аутентификации
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("Ошибка данных", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const data = req.body; // Извлекаем данные из запроса
    const userID = decodeAccessToken(req.cookies.access).userID;

    try {
      const updateResult = await updateInfoUser(userID, data); // Обновляем информацию в базе данных
      console.log(updateResult); // Вывод результата обновления в консоль
      res.status(201).json({ message: "Успех!" }); // Отправляем успешный ответ
    } catch (error) {
      console.error("Ошибка обновления данных пользователя:", error);
      res.status(500).json({ error: "Ошибка обновления данных" }); // Отправляем ошибку сервера
    }
  }
);

module.exports = router;
