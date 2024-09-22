const { Router } = require("express");
const { decodeAccessToken } = require("../api/tokens/accessToken");
const router = Router();
const { isAuth } = require("../api/middlewares/auth");
const { searchFastWorkById } = require("../database/Request/FastWork");
router.get("/edit-fastwork", isAuth, async (req, res) => {
  let access = await req.cookies.access;
  let id = req.query.id;
  console.log(id);
  let user = decodeAccessToken(access);
  if (user.userROLE !== "creatorWork") return res.redirect("login");
  let findFastWork = await searchFastWorkById(id, user.userID);
  if (!findFastWork.success) {
    return res.redirect("/"); // redirect to 404 page if vacancy not found. 404 page should be implemented in the front-end. 404 page should be a separate page. 404 page should not be a part of the backend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the frontend. 404 page should be a part of the
  }
  console.log(findFastWork);
  res.render("editFastWork", {
    isLoggedIn: false,
    id: user.userID,
    username: "",
    data: findFastWork.data,
  });
});

module.exports = router;
