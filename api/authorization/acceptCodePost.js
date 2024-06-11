const { validationResult } = require("express-validator");
let sendCode = require("../verefyPost/sendCodeRegistration");
const CodeForPostRegistration = require("../../database/Schema/CodeForPostRegistration");

async function acceptCodeFromPost(req, res) {
  let result = await validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }

  try {
    let { mail, codeUser } = req.body;

    let findMail = await CodeForPostRegistration.findOne({ mail });
    console.log(findMail);
    if (findMail) {
      if (findMail.code === codeUser) {
        await findMail.updateOne({ active: true });
        return await res.status(202).json({ message: "Код верный" });
      }
      if (findMail.count_try >= 10) {
        let code = await generateCode();
        let sendCodeVar = await sendCode({
          userPost: mail,
          code,
          username: " еще раз!",
        });
        if (!sendCodeVar) {
          return await res.status(500).json({ message: "Не верный код" });
        }
        await findMail.updateOne({ code, count_try: 0 });
        return res.status(200).json({ message: "Код отправлен еще!" });
      }
      await findMail.updateOne({ count_try: findMail.count_try + 1 });
      return await res.status(401).json({ message: "Код неверный" });
    }
    return await res.status(401).json({ message: "Код неверный" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = acceptCodeFromPost;
function generateCode() {
  return Math.floor(Math.random() * 999999);
}
