let { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { Router } = require("express");
const router = Router();
const { searchUserId } = require("../database/Request/User");
const { findUsersByFavorites } = require("../database/Request/User");
const { searchVacancyByUserId } = require("../database/Request/Vacancy");
const {
  findFAllFavoriteOfId,
  getMyFavorites,
} = require("../database/Request/FavoriteVacancy");
const { findCompanyOfUser } = require("../database/Request/Company");
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
        if (result.role === "worker") {
          console.log("Мой профиль");
          let myFavoritesVacancy = await getMyFavorites(result.id);
          console.log("Мой профиль");
          console.log(myFavoritesVacancy);
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
            myFV: myFavoritesVacancy.data,
            expiriens: result.expiriens,
            premium: result.premium,
            description: result.description,
          });
        }
        let vacancys = await searchVacancyByUserId(result.id);
        let findCompany = await findCompanyOfUser(decodeAccess.userID);
        console.log(findCompany);
        if (!findCompany.success) findCompany = { data: null };
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
          company: findCompany.data,
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
      return res.render("seeSideProf.ejs", {
        isLoggedIn: decodeAccess,
        id: decodeAccess.userID,
        name: result.name,
        surname: result.surname,
        contacts: result.contacts,
        job: result.job,
        chatList: decodeAccess.chatList || null,
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
      let vacancys = await searchVacancyByUserId(result.id);
      let findAllFV = await findFAllFavoriteOfId(decodeAccess.userID);

      if (!findAllFV.success) {
        findAllFV = { data: { vacancyID: [] } }; // Обеспечиваем, что data будет пустым массивом в случае ошибки
      }
      let findCompany = await findCompanyOfUser(decodeAccess.userID);
      console.log(findCompany);
      if (!findCompany.success) findCompany = { data: null };
      res.render("SeSideHr.ejs", {
        isLoggedIn: decodeAccess,
        id: decodeAccess.userID,
        name: result.name,
        chatList: decodeAccess.chatList || null,
        surname: result.surname,
        job: result.job,
        title: `${result.surname} ${result.name}`,
        age,
        premium: result.premium,
        city: result.city,
        avatar: result.avatar,
        isFav: favorites ? favorites.some((item) => item.id === id) : null,
        portfolios: result.portfolio,
        company:findCompany.data, 
        vacancys: vacancys.data,
        im: decodeAccess.userROLE || null,
        contacts: result.contacts,
        status: result.status,
        myFavorites: findAllFV.data.vacancyID,
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
