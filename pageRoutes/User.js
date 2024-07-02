let {
  decodeAccessToken,
  createAccessToken,
} = require("../api/tokens/accessToken");
const { Router } = require("express");
const router = Router();
const { searchUserId } = require("../database/Request/User");

router.get("/:id", async (req, res, next) => {
  let access = req.cookies.access;
  let id = req.params.id;
  let result = await searchUserId(id);
  console.log(id);
  if (result === null) {
    return res.render("pageNotFaund");
  }
  console.log(result);
  if (access) {
    let decodeAccess = await decodeAccessToken(access);
    if (decodeAccess.userID === id) {
      if (result.role === "worker") {
        const age = calculateAge(result.birthDay);
        return res.render("ImProfessional.ejs", {
          isLoggedIn: true,
          id:result.id,
          name: result.name,
          surname: result.surname,
          job: result.job,
          age,
          city: result.city,
          status: result.status,
          description: result.description,
        });
      }
      return res.render("ImHR.ejs", { isLoggedIn: true });
    }
  }

  if (result.role === "worker") {
    return res.render("seeSideProf.ejs", { isLoggedIn: false });
  } else {
    res.render("SeSideHr.ejs", { isLoggedIn: false });
  }
});

module.exports = router;
function calculateAge(birthdateString) {
    // Проверяем, что дата введена в правильном формате
    const dateParts = birthdateString.split('-');
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
  