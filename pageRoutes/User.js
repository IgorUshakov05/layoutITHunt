let { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { Router } = require("express");
const router = Router();
const { searchUserId } = require("../database/Request/User");
const { findUsersByFavorites } = require("../database/Request/User");
const {searchVacancyByUserId} = require("../database/Request/Vacancy");
router.get("/:id", isAuthNotRequire, async (req, res, next) => {
  try {
    let access = req.cookies.access;
    let id = req.params.id;
    let result = await searchUserId(id);
    if (result === null) {
      return res.render("pageNotFaund");
    }
    let decodeAccess = await decodeAccessToken(access);
    if (!decodeAccess && access) {
      return res.redirect("/login");
    }
    var favorites = null;
    const age = calculateAge(result.birthDay);
    if (access) {
      let findMyProf = await searchUserId(decodeAccess.userID);
      favorites = (await findUsersByFavorites(findMyProf.favorite)) || [];
      if (decodeAccess.userID === id) {
        console.log(favorites);
        console.log(result);
        if (result.role === "worker") {
          console.log(favorites);
          return res.render("ImProfessional.ejs", {
            isLoggedIn: decodeAccess,
            id: decodeAccess.userID,
            name: result.name,
            chatList: decodeAccess.chatList,
            surname: result.surname,
            contacts: result.contacts,
            job: result.job,
            skills: result.skills,
            title: "Мой профиль",
            age,
            portfolios: result.portfolio,
            city: result.city,
            status: result.status,
            favorite: favorites,
            education: result.education,
            avatar: result.avatar,
            expiriens: result.expiriens,
            premium: result.premium,
            description: result.description,
          });
        }
        let vacancys = await searchVacancyByUserId(decodeAccess.userID);
        console.log(vacancys);
        return res.render("ImHR.ejs", {
          isLoggedIn: decodeAccess,
          id: decodeAccess.userID,
          name: result.name,
          surname: result.surname,
          job: result.job,
          chatList: decodeAccess.chatList,
          title: "Мой профиль",
          avatar: result.avatar,
          age,
          city: result.city,
          premium: result.premium,
          vacancys: vacancys.data,
          favorite: favorites,
          contacts: result.contacts,
          portfolios: result.portfolio,
          status: result.status,
          description: result.description,
        });
      }
    }

    if (result.role === "worker") {
      console.log(favorites, id);
      return res.render("seeSideProf.ejs", {
        isLoggedIn: decodeAccess,
        id: decodeAccess.userID,
        name: result.name,
        surname: result.surname,
        contacts: result.contacts,
        job: result.job,
        chatList: result.chatList || null,
        avatar: result.avatar,
        title: `${result.surname} ${result.name}`,
        age,
        city: result.city,
        skills: result.skills,
        premium: result.premium,
        education: result.education,
        isFav: favorites ? favorites.some((item) => item.id === id) : null,
        im: decodeAccess.userROLE || null,
        status: result.status,
        portfolios: result.portfolio,
        expiriens: result.expiriens,
        description: result.description,
      });
    } else {
      let vacancys = await searchVacancyByUserId(decodeAccess.userID);
      console.log(vacancys);
      res.render("SeSideHr.ejs", {
        isLoggedIn: decodeAccess,
        id: decodeAccess.userID,
        name: result.name,
        chatList: result.chatList || null,
        surname: result.surname,
        job: result.job,
        title: `${result.surname} ${result.name}`,
        age,
        premium: result.premium,
        city: result.city,
        avatar: result.avatar,
        isFav: favorites ? favorites.some((item) => item.id === id) : null,
        portfolios: result.portfolio,
        vacancys: vacancys.data,
        im: decodeAccess.userROLE || null,
        contacts: result.contacts,
        status: result.status,
        description: result.description,
      });
    }
  } catch (e) {
    return false;
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
