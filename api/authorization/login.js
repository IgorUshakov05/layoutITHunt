const { validationResult } = require("express-validator");
const { dehashPassword } = require("../password/password");
const { createAccessToken } = require("../tokens/accessToken");
const { createRefreshToken } = require("../tokens/refreshToken");
const useragent = require("express-useragent");
const {searchUserEmail} = require("../../database/Request/User");
const { newToken } = require("../../database/Request/Refresh");


async function Login(req, res) {
  try  {
    const result = await validationResult(req);
    if (!result.isEmpty()) {
      return await res.send({ errors: result.array() });
    }
    const { email, password } = req.body;
    let findOfEmail = await searchUserEmail(email);
    console.log(findOfEmail)
    if(!findOfEmail) {
      console.error("Ошибка входа:", error);
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    let hashPassword = await dehashPassword(password,findOfEmail.password);
    if(!hashPassword) {
      console.log("Пароль неверный")
      return res.status(401).json({ error: "Пароль неверный" });
    }
    const accessTokenCookie = await createAccessToken({
      userID: findOfEmail.id,
      userMAIL: findOfEmail.mail,
      userROLE: findOfEmail.role,
    });

    let source = await req.headers["user-agent"];
    let ua = useragent.parse(source);

    const refreshTokenCookie = await createRefreshToken({
      userID: findOfEmail.id,
      userMAIL: findOfEmail.mail,
      browser: ua.source, // Используйте ua.browser вместо ua.source
      ip: req.ip,
    });
    if (!refreshTokenCookie) {
      return res.status(500).json({ error: "Ошибка входа" });
    }
    console.log(email, password);
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
  }
  catch(error) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

}

module.exports = Login;
