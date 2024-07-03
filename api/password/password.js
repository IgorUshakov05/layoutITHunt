const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  let salt = await bcrypt.genSaltSync(10);
  let hash = await bcrypt.hashSync(password, salt);
  return hash;
};

const dehashPassword =  (UserPassword, DBPassword) => {
  let hash =  bcrypt.compareSync(UserPassword, DBPassword);
  return hash;
};

module.exports = { hashPassword, dehashPassword };
