const UserSchema = require("../../database/Schema/UserSchema");
const CodeForPostRegistration = require("../../database/Schema/CodeForPostRegistration");
let { v4 } = require("uuid");
const createUser = async (data) => {
  try {
    let { surname, name, birthDay, role, mail, password } = data;
    let verefyMail = await CodeForPostRegistration.findOne({
      mail,
      active: true,
    });
    if (!verefyMail) {
      return false;
    }
    let findUserMail = await UserSchema.findOne({ mail });
    if (findUserMail) {
      return false;
    }
    const day =
      new Date().getDate() <= 9
        ? "0" + new Date().getDate()
        : new Date().getDate();
    const month =
      new Date().getMonth() <= 9
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const formattedDate = day + "-" + month + "-" + year;

    const user = await new UserSchema({
      id: v4(),
      surname,
      name,
      birthDay,
      role,
      mail,
      dateRegistration: formattedDate,
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
