const { Router } = require("express");
const router = Router();
const {isAuth} = require('../api/middlewares/auth');
router.get("/find-company", isAuth, (req, res) => {
  res.render("findCompany", { isLoggedIn: false, username: "" });
});

module.exports = router;
