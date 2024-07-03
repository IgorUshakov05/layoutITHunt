const {Router} = require('express')
const router = Router()
const { searchUserId } = require("../database/Request/User");
const {isAuth} = require('../api/middlewares/auth');

router.get('/buy-premium', isAuth,async(req,res) => {
    let access = req.cookies.access;
  let id = req.params.id;
  let result = await searchUserId(id);
  console.log(id);
  if (result === null) {
    return res.render("pageNotFaund");
  }
  console.log(result);
    res.render('buy-premium', {
        isLoggedIn: true,
        id:result.id, 
        name: result.name,
        surname: result.surname,
        job: result.job,
        title: "Мой профиль",
        age,
        city: result.city,
        status: result.status,
        description: result.description,
      })
})

module.exports = router