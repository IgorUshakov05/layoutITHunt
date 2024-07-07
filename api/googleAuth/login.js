const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Router } = require("express");
const passport = require("passport");
const useragent = require("express-useragent");
const { createAccessToken } = require("../tokens/accessToken");
const { createRefreshToken } = require("../tokens/refreshToken");
const { searchUserEmail } = require("../../database/Request/User");
const { newToken } = require("../../database/Request/Refresh");

const router = Router();

// Настройка стратегии Google
passport.use(
  'google-login',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + process.env.GOOGLE_CALLBACK_URL_LOGIN,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const { emails } = profile;
        let findOfEmail = await searchUserEmail(emails[0].value);
        return cb(null, findOfEmail);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

// Сериализация пользователя
passport.serializeUser((user, done) => {
  done(null, user);
});

// Десериализация пользователя
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Маршрут для аутентификации с Google
router.get(
  "/auth/login",
  passport.authenticate("google-login", { scope: ["profile", "email"] })
);

// Маршрут обратного вызова от Google
router.get(
  process.env.GOOGLE_CALLBACK_URL_LOGIN,
  passport.authenticate("google-login", { failureRedirect: "/login?error=2" }),
  async (req, res) => {
    try {
      let findOfEmail = req.user;
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
      let saveToken = newToken(refreshTokenCookie);
      if (!saveToken) {
        return res.status(500).json({ error: "Ошибка входа" });
      }
      let sliceToken =
        (await refreshTokenCookie.slice(0, 6)) + refreshTokenCookie.slice(-6);

      // Установка куки
      await res.status(200);
      await res.cookie("access", accessTokenCookie, {
        maxAge: 3600000, // 1 час
        httpOnly: true, // Куки доступны только для сервера
      });
      await res.cookie("refresh", sliceToken, {
        maxAge: 3600000 * 7, // 1 неделя
        httpOnly: true,
      });
      return await res.redirect("/");
    } catch (error) {
      console.error("Error during login redirect:", error);
      res.redirect("/login?error=2");
    }
  }
);

module.exports = router;
