const CompanySchema = require("../Schema/Company");
const UserSchema = require("../Schema/UserSchema");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");

async function createCompany({
  title,
  INN,
  description,
  avatar,
  creatorID,
  countStaffs
}) {
  try {
    let findFirst = await CompanySchema.findOne({
      $or: [{ INN }, { creatorID }],
    });
    if (findFirst) return { success: false, error: "Company already exists" };

    const now = Temporal.Now.plainDateTimeISO();
    const company = await new CompanySchema({
      id: v4(),
      title,
      INN,
      description,
      avatar,
      creatorID,
      userList: [{ userID: creatorID }],
      dataCreated: now,
      countStaffs,
    });
    const user = await UserSchema.findOne({ id: creatorID });
    if (!user) return { success: false, error: "User not found" };
    let saveCompany = await company.save();
    return { success: true, data: saveCompany };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error" };
  }
}
module.exports = createCompany;
