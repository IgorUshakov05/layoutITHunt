let GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Router } = require("express");
const passport = require("passport");
const useragent = require("express-useragent");
const { searchUserEmail } = require("../../database/Request/User");
const { newToken } = require("../../database/Request/Refresh");
const router = Router();

passport.use(
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
        console.log(findOfEmail);
        return await cb(null, findOfEmail);
      } catch (error) {
        return await cb(null, profile);
      }
    }
  )
);

passport.serializeUser(async (user, done) => {
    try  {
        console.log(user)
        if(!user) {
          console.error("Ошибка входа:", error);
          return done(null,null)
        }
        const accessTokenCookie = await createAccessToken({
          userID: user.id,
          userMAIL: user.mail,
          userROLE: user.role,
        });
    
        let source = await req.headers["user-agent"];
        let ua = useragent.parse(source);
    
        const refreshTokenCookie = await createRefreshToken({
          userID: user.id,
          userMAIL: user.mail,
          browser: ua.source, // Используйте ua.browser вместо ua.source
          ip: req.ip,
        });
        if (!refreshTokenCookie) {
          return done(null,null)
        }
        let saveToken = await newToken(refreshTokenCookie);
        if (!saveToken) {
            return done(null,null)
        }
        let sliceToken = await refreshTokenCookie.slice(0, 6)+refreshTokenCookie.slice(-6)
    
        await res
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
          return done(null,user)
      }
      catch(error) {
        return done(null,null)
      }
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log(user)
    done(null, user);
  } catch (error) {
    done(error);
  }
});

router.get(
  "/auth/login",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get(
  "/google/login/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
