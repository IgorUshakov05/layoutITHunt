const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { isAuth } = require("../middlewares/auth");
const createCompany = require("./createCompany");
router.post(
  "/create-company",
  isAuth,
  [
    check("title")
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage("Title must be between 3 and 50 characters"),
    check("INN")
      .isString()
      .isLength({ min: 10, max: 15 })
      .withMessage("INN must be between 10 and 15 characters"),
    check("description")
      .isString()
      .isLength({ min: 5, max: 250 })
      .withMessage("Description must be between 5 and 250 characters"),
    check("avatar")
      .optional()
      .isString()
      .withMessage("Avatar must be a string if provided"),
    check("countStaffs")
      .isInt({ min: 5, max: 200 })
      .isIn([5, 20, 50, 100, 200])
      .withMessage(
        "CountStaffs must be one of the following values: 5, 20, 50, 100, 200"
      ),
  ],
  createCompany
);

module.exports = router;
