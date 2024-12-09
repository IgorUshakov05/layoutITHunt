const { Router } = require("express");
const router = Router();
const { getSpecialList } = require("../../database/Request/User");
const { decodeAccessToken } = require("../tokens/accessToken");
router.post("/user", async (req, res) => {
  try {
    console.log(req.body, " - тело");
    let access = req.cookies.access;
    let user = await decodeAccessToken(access);
   
    let expiriens = req.body.expiriens;
    let userData = await {
      job: req.body?.job?.length === 0 ? null : req.body?.job,
      name: req.body.firstName || null,
      surname: req.body.lastName || null,
      skills: req.body?.skills?.length === 0 ? null : req.body?.skills,
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
    console.log();
    if (!users.success)
      return res.status(404).json({ message: "Возникла ошибка" });
    res.status(200).json(users);
  } catch (e) {
    console.log(e, " - ошибка");

    return res.redirect({
      success: false,
      message: "Ошибка при получении пользователей",
    });
  }
});
module.exports = router;
