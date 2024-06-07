const UserSchema = require("../../database/Schema/UserSchema");
let { v4 } = require("uuid");
const createUser = async (data) => {
  try {
    let { surname, name, birthDay, role, mail, password } = data;
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
