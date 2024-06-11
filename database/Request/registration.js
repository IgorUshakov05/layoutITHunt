const UserSchema = require("../../database/Schema/UserSchema");
const CodeForPostRegistration = require("../../database/Schema/CodeForPostRegistration");
let { v4 } = require("uuid");
const createUser = async (data) => {
  try {
    let { surname, name, birthDay, role, mail, password } = data;
    let verefyMail =await CodeForPostRegistration.findOne({mail, active:true})
    if(!verefyMail) {
      return false;
    }
    const user = await new UserSchema({
      id: v4(),
      surname,
      name,
      birthDay,
      role,
      mail,
      password,
    });
  
    let result = await user.save();
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = createUser;
