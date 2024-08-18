const { decodeAccessToken } = require("../tokens/accessToken");
const { validationResult } = require("express-validator");
const createCompany = require("../../database/Request/Company");
module.exports = async function (req, res) {
  let access = req.cookies.access;
  if (!access) return res.redirect("/login");
  const decodeAccess = await decodeAccessToken(access);
  if (decodeAccess.userROLE !== "creatorWork") return res.redirect("/");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, INN, description, avatar, countStaffs } = req.body;
  let saveCompany = await createCompany({
    title,
    INN,
    description,
    avatar,
    creatorID: decodeAccess.userID,
    countStaffs,
  });
  console.log(saveCompany.error);
  if (!saveCompany.success)
    return res.status(500).json({ error: "Ошибка пр исоздании" });
  await res.status(200).json({ success: true });
};
