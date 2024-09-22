const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../tokens/accessToken");
const { updateInfoUser } = require("./Request/updateUserInfo");
const { isAuth } = require("../middlewares/auth");
const { body, validationResult } = require("express-validator");

router.post(
  "/setSettings",
  body("job")
    .custom((value, { req }) => {
      if (value === undefined || value === "") {
        return true;
      }
      const validJobs = [
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
      if (!validJobs.includes(value)) {
        throw new Error('Недопустимое значение для поля "job".');
      }
      return true;
    })
    .withMessage('Недопустимое значение для поля "job".'),
  body("surname").isLength({ min: 2 }).optional(),
  body("name").isLength({ min: 2 }).optional(),
  body("birthDay")
    .optional()
    .isDate({ format: "DD-MM-YYYY" })
    .withMessage("Введенное значение не является датой.")
    .custom((value) => {
      if (value === undefined || value === "") {
        return true; // Пропускаем валидацию, если значение пустое
      } else {
        // Разбиваем строку на части
        const [day, month, year] = value.split("-").map(Number);

        // Проверяем валидность полученных значений
        if (
          !day ||
          !month ||
          !year ||
          day > 31 ||
          month > 12 ||
          year < 1000 ||
          year > 9999
        ) {
          return Promise.reject("Введенное значение не является датой.");
        }

        // Создаем объект Date с учетом нашего формата
        const date = new Date(year, month - 1, day); // month - 1, так как месяцы начинаются с 0

        // Проверяем, что день и месяц соответствуют введенным (например, дата 31-02-2021 некорректна)
        if (
          date.getFullYear() !== year ||
          date.getMonth() + 1 !== month ||
          date.getDate() !== day
        ) {
          return Promise.reject("Введенное значение не является датой.");
        }

        // Сравнение только дат, без времени
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Обнуляем время в today

        return date < today;
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
