const { Router } = require("express");
const router = Router();
const registration = require("../authorization/registration");
const registration_with_google = require("../authorization/registration_with_google.js");
const login = require("../authorization/login");
const post = require("../authorization/verefyPost");
const acceptCodeFromPost = require("../authorization/acceptCodePost");
const { body } = require("express-validator");

router.post(
  "/registration",
  body("mail").isEmail(),
  body("password").isLength({ min: 6 }),
  body("surname").isLength({ min: 2 }),
  body("name").isLength({ min: 2 }),
  body("role").isIn(["worker", "creatorWork"]),
  body("birthDay")
    .isDate({ format: "DD-MM-YYYY" })
    .withMessage("Введенное значение не является датой."),
  body("reply_password").custom((value, { req }) => {
    return value === req.body.password;
  }),
  registration
);

router.post(
  "/registration_with_google",
  body("role").isIn(["worker", "creatorWork"]),
  body("birthDay")
    .isDate({ format: "DD-MM-YYYY" })
    .withMessage("Введенное значение не является датой."),
    registration_with_google
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  login
);
router.post(
  "/post_verefy",
  body("mail").isEmail(),
  body("username").isLength({ min: 2 }),
  post
);

router.post(
  "/accept_code",
  body("mail").isEmail(),
  body("codeUser").isLength({ min: 6, max: 6 }),
  acceptCodeFromPost
);



module.exports = router;
