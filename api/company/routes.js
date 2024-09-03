const { Router } = require("express");
const router = Router();
const { isAuth } = require("../middlewares/auth");
const {
  findCompanyOfUserAndINN,
  getNotVerefy,
} = require("../../database/Request/Company");
const { decodeAccessToken } = require("../tokens/accessToken");
const { body, validationResult } = require("express-validator");
const findCompany = require("./findCompanyForInvite");

router.post(
  "/verefy-company",
  [
    body("INN")
      .isLength({ min: 9, max: 20 })
      .withMessage("INN must be between 9 and 20 characters."),
  ],
  isAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    let access = await req.cookies.access;
    if (!access) return res.redirect("/login");
    const decodeAccess = await decodeAccessToken(access);
    if (!decodeAccess) return res.redirect("/login");
    let findCompanyOfUser = await findCompanyOfUserAndINN(
      decodeAccess.userID,
      req.body.INN
    );
    console.log(findCompanyOfUser);
    if (!findCompanyOfUser.success)
      return res.status(400).json({
        success: false,
        message: "Компания с таким ИНН уже есть,или вы уже владелец компании",
      });
    return res
      .status(201)
      .json({ success: true, message: "Компания не зарегестриоована" });
  }
);

router.post(
  "/invite-company",
  [body("text").isLength({ min: 3, max: 250 }).withMessage("Min 3, Max 250")],
  isAuth,
  findCompany
);


module.exports = router;
