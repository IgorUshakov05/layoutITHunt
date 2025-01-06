const { Router } = require("express");
const router = Router();
const { sendSkill } = require("./getSkillOfSirvice");
const { v4 } = require("uuid");
let { decodeAccessToken } = require("../tokens/accessToken");
const { isAuthNotRequire } = require("../../api/middlewares/authNotRequire");
const {
  saveSkillIntoOurBase,
  saveSkillInProfile,
} = require("./addNewSkillUser");
const { removeSkillsFromProfile } = require("./updateUserSkill");
const { check, validationResult } = require("express-validator");

router.get(
  "/setSkills",
  // [
  //   check("title")
  //     .exists()
  //     .isLength({ max: 50 })
  //     .withMessage("Search query is required")
  //     .isString()
  //     .notEmpty(),
  // ],
  async (req, res) => {
    try {
      // const? errors = validationResult(req);
      let title = req.query.title; // Получаем title из query-параметров
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() });
      // }
      let findSkill = await sendSkill(title);
      console.log(findSkill);
      return res.status(200).json(findSkill);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
);

router.post(
  "/setSkills",
  //   [
  //     body("skills")
  //       .exists()
  //       .notEmpty()
  //   ],
  isAuthNotRequire,
  async (req, res) => {
    try {
      let skills = req.body.skills;
      let access = req.cookies.access;
      let decodeAccess = await decodeAccessToken(access);
      if (!skills.length) {
        return await res.status(400).json({ message: "Ну не надо так!" });
      }
      //   const errors = validationResult(req);
      //   if (!errors.isEmpty()) {
      //     return res.status(400).json({ errors: errors.array() });
      //   }
      //   let findSkill = await sendSkill(title);
      let newArray = await skills.map((item) => {
        return { title: item.title, id: v4() };
      });

      let saveSkillVar = await saveSkillIntoOurBase(newArray);
      await saveSkillInProfile(decodeAccess.userID, newArray);
      console.log(newArray);
      if (!saveSkillVar) {
        return res.status(500).json({ error: "Ошибка при сохранении" });
      }

      return await res.status(200).json({ message: "Успех" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
);

router.delete("/setSkills", isAuthNotRequire, async (req, res) => {
  try {
    let skills = req.body.skills;
    let access = req.cookies.access;
    let decodeAccess = await decodeAccessToken(access);

    if (!skills.length) {
      return res.status(400).json({ message: "Ну не надо так!" });
    }

    let removeSkillVar = await removeSkillsFromProfile(
      decodeAccess.userID,
      skills
    );

    if (!removeSkillVar) {
      return res.status(500).json({ error: "Ошибка при удалении навыков" });
    }

    return res.status(200).json({ message: "Успех" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});
module.exports = router;
