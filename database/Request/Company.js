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
  countStaffs,
  certificate_of_state_registration = null, // Замените на null, если данные отсутствуют
  tax_registration_certificate = null, // Замените на null, если данные отсутствуют
  egrul_egrip_record_sheet = null, // Замените на null, если данные отсутствуют
}) {
  try {
    let findFirst = await CompanySchema.findOne({
      $or: [{ INN }, { creatorID }],
    });
    if (findFirst) return { success: false, error: "Company already exists" };

    const now = Temporal.Now.plainDateTimeISO();
    const nextPayDay = now.add({ months: 1 });
    const company = new CompanySchema({
      id: v4(),
      title,
      INN,
      description,
      avatar,
      nextPayDay,
      creatorID,
      userList: [{ userID: creatorID }],
      dataCreated: now,
      countStaffs,
      documents: [
        {
          certificate_of_state_registration,
          tax_registration_certificate,
          egrul_egrip_record_sheet,
        },
      ],
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

async function findCompanyOfUser(userID) {
  try {
    console.log(userID);
    let findFirst = await CompanySchema.findOne({
      userList: { $elemMatch: { userID: userID } }, // Ищем, чтобы userID был в массиве userList
      isVarefy: true,
    });
    if (!findFirst) return { success: false, message: "Компании нет" };
    return { success: true, data: findFirst };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error" };
  }
}

async function findCompanyOfINN(INN) {
  try {
    let findFirst = await CompanySchema.findOne({
      INN: INN,
      isVarefy: true,
    });
    console.log(findFirst, ' - тут норм');
    if (!findFirst) return { success: false, message: "Компании нет" };
    return { success: true, data: findFirst };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error" };
  }
}

async function findCompanyOfUserAndINN(userID, INN) {
  try {
    let findFirst = await CompanySchema.findOne({
      $or: [{ INN }, { creatorID: userID }],
    });
    if (findFirst) return { success: false, error: "Company already exists" };
    return { success: true, data: findFirst };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error" };
  }
}
module.exports = {
  createCompany,
  findCompanyOfINN,
  findCompanyOfUser,
  findCompanyOfUserAndINN,
};
