const { Router } = require("express");
const router = Router();
const { sendSkill } = require("./getSkillOfSirvice");
const { check, validationResult } = require("express-validator");

router.get(
  "/setSkills",
  [
    check("title")
      .exists()
      .isLength({ max: 50 })
      .withMessage("Search query is required")
      .isString()
      .notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      let title = req.query.title; // Получаем title из query-параметров
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let findSkill = await sendSkill(title);
      console.log(findSkill);
      return res.status(200).json(findSkill);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
);

module.exports = router;
