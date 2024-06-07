const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  let salt = await bcrypt.genSaltSync(10);
  let hash = await bcrypt.hashSync(password, salt);
  return hash;
};

const dehashPassword = async (UserPassword, DBPassword) => {
  let hash = await bcrypt.compareSync(UserPassword, DBPassword);
  return hash;
};

module.exports = { hashPassword, dehashPassword };
