const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const { isAuthNotRequire } = require("../api/middlewares/authNotRequire");
const { getVacancy } = require("../database/Request/Vacancy");
router.get("/vacancies", isAuthNotRequire, async (req, res) => {
  console.log(req.query);
  //   {
  //   special: '["Frontend","Backend"]',
  //   typeWork: '["Офисная","Удаленная"]',
  //   skills: '["React Native","MongoDB","Hand Painting"]',
  //   city: '[" Абакан"]',
  //   experience: '["ThreeFour"]',
  //   price_min: '100',
  //   price_max: '2000'
  // }
  let stringToJson = (data) => {
    try {
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  let data = {
    special: stringToJson(req.query.special)
      ? { $in: stringToJson(req.query.special) }
      : null,
    typeWork: stringToJson(req.query.typeWork)
      ? {
          $in: stringToJson(
            req.query.typeWork.map((type) => ({ title: type }))
          ),
        }
      : null,
    skills: stringToJson(req.query.skills)
      ? {
          $all: stringToJson(req.query.skills).map((skill) => ({
            title: skill,
          })),
        }
      : null,
    // city: stringToJson(req.query.city),
    experience: stringToJson(req.query.experience)
      ? { $in: stringToJson(req.query.experience) }
      : null,
    "price.minPrice": stringToJson(req.query.price_min)
      ? { $gte: stringToJson(req.query.price_min) }
      : null,
    "price.maxPrice": stringToJson(req.query.price_max)
      ? { $lte: stringToJson(req.query.price_max) }
      : null,
  };
  for (let [key, value] of Object.entries(data)) {
    if (!data[key]) delete data[key];
  }
  console.log(data);
  let access = req.cookies.access;
  let vacancies = await getVacancy(data);
  if (!vacancies.success) {
    return res.redirect("/404");
  }
  let user = decodeAccessToken(access);
  console.log(user);
  return res.render("vacancies", {
    isLoggedIn: !!user,
    vacancies: vacancies.vacancies,
    users: vacancies.users,
    company: vacancies.company,
    id: user.userID,
    chatList: user.chatList || null,
  });
});

module.exports = router;
