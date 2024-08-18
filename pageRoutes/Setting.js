let {
  decodeAccessToken,
  createAccessToken,
} = require("../api/tokens/accessToken");
const { isAuth } = require("../api/middlewares/auth");
const { Router } = require("express");
const router = Router();
const { searchUserId } = require("../database/Request/User");

router.get("/setting", isAuth, async (req, res, next) => {
  let access = req.cookies.access;
  if (!access) {
    return res.redirect("/");
  }
  let decodeAccess = await decodeAccessToken(access);
  let result = await searchUserId(decodeAccess.userID);
  console.log(result);
  if (result === null) {
    return res.redirect("/");
  }
  console.log(result);
  console.log(process.env.FILE_SERVER_PATH, " адрес файлого сервера");

  const age = calculateAge(result.birthDay);
  if (access) {
    if (result.role === "worker") {
      return res.render("settingsSpecialist.ejs", {
        isLoggedIn: decodeAccess,
        id: decodeAccess.userID,
        name: result.name,
        surname: result.surname,
        chatList: decodeAccess.chatList,
        job: result.job,
        contacts: result.contacts,
        portfolios: result.portfolio,
        title: "Мой профиль",
        age,
        city: result.city,
        status: result.status,
        FILE_SERVER: process.env.FILE_SERVER_PATH,
        avatar: result.avatar,
        description: result.description,
      });
    }
    return res.render("settingsHR.ejs", {
      isLoggedIn: decodeAccess,
      id: decodeAccess.userID,
      name: result.name,
      surname: result.surname,
      job: result.job,
      title: "Мой профиль",
      avatar: result.avatar,
      chatList: decodeAccess.chatList,
      age,
      city: result.city,
      FILE_SERVER:process.env.FILE_SERVER_PATH,
      contacts: result.contacts,
      status: result.status,
      description: result.description,
    });
  }
});

module.exports = router;
function calculateAge(birthdateString) {
  // Проверяем, что дата введена в правильном формате
  const dateParts = birthdateString.split("-");
  if (dateParts.length !== 3) {
    return "Неверный формат даты. Используйте формат дд-мм-гггг.";
  }

  const birthdate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // Месяц начинается с 0
  const today = new Date();

  // Вычисляем возраст
  let age = today.getFullYear() - birthdate.getFullYear();
  if (
    today.getMonth() < birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() &&
      today.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  return age;
}
