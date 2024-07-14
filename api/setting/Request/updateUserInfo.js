const UserSchema = require("../../../database/Schema/UserSchema");

const updateInfoUser = async (id, data) => {
  try {
    let {
      name,
      surname,
      city,
      status,
      avatar,
      birthDay,
      job,
      description,
      portfolio,
      contacts,
    } = data;
    let updateData = {
      ...(name && { name }),
      ...(surname && { surname }),
      ...(city && { city }),
      ...(avatar && { avatar }),
      ...(status && { status }),
      ...(birthDay && { birthDay }),
      ...(job && { job }),
      ...(description && { description }),
      ...(portfolio && { portfolio }),
      ...(contacts && { contacts }),
    };

    let findUser = await UserSchema.findOneAndUpdate({ id }, updateData);

    let update = await findUser.updateOne({data})
    return findUser;
  } catch (e) {
    return false;
  }
};

module.exports = { updateInfoUser };
