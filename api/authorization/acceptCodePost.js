const { validationResult } = require("express-validator");
const CodeForPostRegistration = require("../../database/Schema/CodeForPostRegistration");

async function acceptCodeFromPost(req, res) {
    let result = await validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }
  
    try {
      let { mail, code } = req.body;
  
      let findMail = await CodeForPostRegistration.findOneAndUpdate({ mail,code }, {active: true});
      console.log(findMail);
      if (!findMail) {
        return res.status(409).json({ message: 'Код неверный' });
      }
  

      return res.status(200).json({ message: 'Код верный' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  

module.exports = acceptCodeFromPost;
