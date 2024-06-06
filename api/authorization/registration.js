const { query, validationResult } = require('express-validator');

const registrationUser = require('../../database/Request/registration')

async function Registration(req,res) {
    const result = await validationResult(req);
    if (!result.isEmpty()) {
        return await res.send({ errors: result.array() });
      }
      const data = await req.body

    let userInsertToDataBase = await registrationUser(data)
    console.log(userInsertToDataBase)
    if(!!!userInsertToDataBase) {
      return res.json({error:"Пользователь существует"})
    }
    return await res.json(userInsertToDataBase)
   
}

module.exports = Registration