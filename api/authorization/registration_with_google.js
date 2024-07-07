const { validationResult } = require("express-validator");
const { hashPassword } = require("../password/password");
const { createAccessToken } = require("../tokens/accessToken");
const { createRefreshToken } = require("../tokens/refreshToken");
const { v4 } = require("uuid");
const useragent = require("express-useragent");
const registrationUser = require("../../database/Request/registration");
const { newToken } = require("../../database/Request/Refresh");

async function Registration(req, res) {
  try {
    // Получение данных пользователя из req.user
    let user = req.user;
    if (!user) {
      return res.redirect('/login?error=2');
    }

    // Валидация данных
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }

    // Подготовка данных для регистрации
    const data = req.body;
    data.password = await hashPassword(v4());
    data.mail = user._json.email;
    data.surname = user._json.family_name;
    data.name = user._json.given_name;
    data.avatar = user._json.picture;

    // Регистрация пользователя в базе данных
    let userInsertToDataBase = await registrationUser(data, true);
    if (!userInsertToDataBase) {
      return res.status(400).json({ error: "Пользователь существует" });
    }

    // Создание токенов
    const accessTokenCookie = await createAccessToken({
      userID: userInsertToDataBase.id,
      userMAIL: userInsertToDataBase.mail,
      userROLE: userInsertToDataBase.role,
    });

    const source = req.headers["user-agent"];
    const ua = useragent.parse(source);
    
    const refreshTokenCookie = await createRefreshToken({
      userID: userInsertToDataBase.id,
      userMAIL: userInsertToDataBase.mail,
      browser: ua.source,
      ip: req.ip,
    });

    if (!refreshTokenCookie) {
      return res.status(500).json({ error: "Ошибка регистрации" });
    }

    const saveToken = await newToken(refreshTokenCookie);
    if (!saveToken) {
      return res.status(500).json({ error: "Ошибка регистрации" });
    }

    const sliceToken = refreshTokenCookie.slice(0, 6) + refreshTokenCookie.slice(-6);

    // Установка куки
    res.cookie("access", accessTokenCookie, {
      maxAge: 3600000, // 1 час
      httpOnly: true, // Куки доступны только для сервера
      secure: true, // Куки передаются только по HTTPS
    });
    res.cookie("refresh", sliceToken, {
      maxAge: 3600000 * 7, // 1 неделя
      httpOnly: true,
      secure: true,
    });

    return res.redirect('/');
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return res.status(500).json({ error: "Ошибка регистрации" });
  }
}

module.exports = Registration;