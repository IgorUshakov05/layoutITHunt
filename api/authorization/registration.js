const { validationResult } = require("express-validator");
const { hashPassword } = require("../password/password");
const { createAccessToken } = require("../tokens/accessToken");
const { createRefreshToken } = require("../tokens/refreshToken");
const useragent = require("express-useragent");
const registrationUser = require("../../database/Request/registration");
const { newToken } = require("../../database/Request/Refresh");

async function Registration(req, res) {
  try {
    console.log(req.user)
    const result = await validationResult(req);
    if (!result.isEmpty()) {
      return await res.send({ errors: result.array() });
    }
    const data = await req.body;
    data.password = await hashPassword(data.password);

    let userInsertToDataBase = await registrationUser(data);

    // Проверка на существование пользователя
    if (!userInsertToDataBase) {
      return res.status(400).json({ error: "Пользователь существует" });
    }

    // Создание токенов
    const accessTokenCookie = await createAccessToken({
      userID: userInsertToDataBase.id,
      userMAIL: userInsertToDataBase.mail,
      chatList: userInsertToDataBase.chatList,
      userROLE: userInsertToDataBase.role,
    });

    let source = await req.headers["user-agent"];
    let ua = useragent.parse(source);

    const refreshTokenCookie = await createRefreshToken({
      userID: userInsertToDataBase.id,
      userMAIL: userInsertToDataBase.mail,
      browser: ua.source, // Используйте ua.browser вместо ua.source
      ip: req.ip,
    });
    if (!refreshTokenCookie) {
      return res.status(500).json({ error: "Ошибка регистрации" });
    }

    let saveToken = newToken(refreshTokenCookie);
    if (!saveToken) {
      return res.status(500).json({ error: "Ошибка регистрации" });
    }
    let sliceToken = await refreshTokenCookie.slice(0, 6)+refreshTokenCookie.slice(-6)

    // Установка куки
    return await res
      .status(200)
      .cookie("access", accessTokenCookie, {
        maxAge: 3600000, // 1 час
        httpOnly: true, // Куки доступны только для сервера
        secure: true // Куки передаются только по HTTPS
      })
      .cookie("refresh", sliceToken, { 
        maxAge: 3600000 * 7, // 1 неделя
        httpOnly: true, 
        secure: true 
      })
      .redirect('/');
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return res.status(500).json({ error: "Ошибка регистрации" });
  }
}

module.exports = Registration;
