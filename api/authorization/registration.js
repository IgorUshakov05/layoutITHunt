const { query, validationResult } = require("express-validator");
const { hashPassword } = require("../password/password");

const registrationUser = require("../../database/Request/registration");

async function Registration(req, res) {
  const result = await validationResult(req);
  if (!result.isEmpty()) {
    return await res.send({ errors: result.array() });
  }
  const data = await req.body;
  data.password = await hashPassword(data.password);
  let userInsertToDataBase = await registrationUser(data);
  if (!!!userInsertToDataBase) {
    return res.status(400).json({ error: "Пользователь существует" });
  }
  return await res.status(200).json({message:"Успех!"});
}

module.exports = Registration;
