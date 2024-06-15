const { validationResult } = require("express-validator");
const { hashPassword } = require("../password/password");
const { createAccessToken } = require("../tokens/accessToken");
const registrationUser = require("../../database/Request/registration");

async function Registration(req, res) {
  const result = await validationResult(req);
  if (!result.isEmpty()) {
    return await res.send({ errors: result.array() });
  }
  const data = await req.body;
  data.password = await hashPassword(data.password);
  let userInsertToDataBase = await registrationUser(data);
  if (!!!userInsertToDataBase) {
    return res.status(400).json({ error: "Пользователь существует" });
  }
  let accessTokenCookie = await createAccessToken({
    userID: userInsertToDataBase.id,
    userMAIL: userInsertToDataBase.mail,
    userROLE: userInsertToDataBase.role,
  });
  // let access = createAccessToken()
  return await res
    .clearCookie("access")
    .status(200)
    .cookie("access", accessTokenCookie, {
      httpOnly: true,
      maxAge: 3600000,
    })
    .json({ message: "Успех!" });
}

module.exports = Registration;
