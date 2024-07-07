const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Router } = require("express");
const passport = require("passport");
const useragent = require("express-useragent");
const { searchUserEmail } = require("../../database/Request/User");

const router = Router();

// Настройка стратегии Google для регистрации
passport.use(
  'google-registration',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + process.env.GOOGLE_CALLBACK_URL_REGISTRATION,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const { emails } = profile;
        let findOfEmail = await searchUserEmail(emails[0].value);
        if (findOfEmail) {
          return cb(null, false, { message: 'User already exists' });
        }
        return cb(null, profile);
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

// Маршрут для аутентификации с Google для регистрации
router.get(
  "/auth/registration",
  passport.authenticate("google-registration", { scope: ["profile", "email"] })
);

// Маршрут обратного вызова от Google для регистрации
router.get(
  process.env.GOOGLE_CALLBACK_URL_REGISTRATION,
  passport.authenticate("google-registration", { failureRedirect: "/login?error=3" }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("/login?error=3");
      }
      let user = req.user;

      // Сериализация объекта пользователя в строку JSON
      const userString = JSON.stringify(user);

      // Установка куки с сериализованным пользователем
      res.cookie("user", userString, {
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        sameSite: 'None',
        secure: false // Установите secure в false для тестирования на HTTP
      });

      // Перенаправление на страницу добавления данных
      res.redirect("/add-data");
    } catch (error) {
      console.error("Error during registration redirect:", error);
      res.redirect("/login?error=3");
    }
  }
);

module.exports = router;