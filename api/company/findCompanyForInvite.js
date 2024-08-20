const { validationResult } = require("express-validator");
const {findCompanyOfINNorTitle} = require('../../database/Request/Company');
const findCompany = async (req, res) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  console.log(req.body);
  let findCompany = await findCompanyOfINNorTitle(req.body.text);
  res.status(200).json(findCompany);
};

module.exports = findCompany;
