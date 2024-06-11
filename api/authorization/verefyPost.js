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
      return res.status(409).json({ message: "Code already sent" });
    }

    let code = await generateCode();

    let sendCodeVar = await sendCode({ userPost: mail, code, username });
    if (!sendCodeVar) {
      return res.status(500).json({ message: "Failed to send code" });
    }

    let codeToBase = await new CodeForPostRegistration({
      mail,
      code,
      time: new Date().getTime(),
    }).save();
    return res.status(200).json({ message: "Code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = verifyPostRoute;

function generateCode() {
  return Math.floor(Math.random() * 999999);
}
