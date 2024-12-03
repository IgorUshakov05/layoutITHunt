const { Router } = require("express");
const router = Router();
const { getSpecialList } = require("../../database/Request/User");
const { decodeAccessToken } = require("../tokens/accessToken");

router.post("/user", async (req, res) => {
  try {
    console.log(req.body);
    let access = req.cookies.access;
    let user = await decodeAccessToken(access);
    console.log(req.body);
    let expiriens = req?.body?.expiriens
      ? JSON.parse(req.body.expiriens)
      : null;
    let userData = {
      job: req.body?.job ? JSON.parse(req?.body?.job) : null,
      name: req.body.name || null,
      surname: req.body.surname || null,
      skills: req.body?.skills ? JSON.parse(req?.body?.skills) : null,
      city: req.body.city || null,
      expiriens: expiriens
        ? [
            !isNaN(Number(expiriens?.[0])) ? Number(expiriens?.[0]) : null,
            !isNaN(Number(expiriens?.[1])) ? Number(expiriens?.[1]) : null,
          ]
        : null,
    };
    console.log(userData, " - данные для функции");
    let users = await getSpecialList(userData, user?.userID, req.query.limit);
    console.log(users.users[1], " - премиум");
    if (!users.success)
      return res.status(404).json({ message: "Возникла ошибка" });
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    return res.redirect("501");
  }
});
module.exports = router;
