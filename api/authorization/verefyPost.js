const { validationResult } = require("express-validator");
let sendCode = require("../verefyPost/sendCodeRegistration");
const CodeForPostRegistration = require("../../database/Schema/CodeForPostRegistration");

async function verifyPostRoute(req, res) {
  let result = await validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  try {
    let { mail, username } = req.body;

    let findMail = await CodeForPostRegistration.findOne({ mail });
    console.log(findMail);
    if (findMail) {
      return res.status(409).json({ message: "Код уже был отправлен" });
    }

    let code = await generateCode();

    let sendCodeVar = await sendCode({ userPost: mail, code, username });
    if (!sendCodeVar) {
      return res.status(500).json({ message: "Ошибка при отправке" });
    }

    let codeToBase = await new CodeForPostRegistration({
      mail,
      code,
      time: new Date().getTime(),
    }).save();
    return res.status(200).json({ message: "Код отправлен" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при отправке" });
  }
}

module.exports = verifyPostRoute;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}
