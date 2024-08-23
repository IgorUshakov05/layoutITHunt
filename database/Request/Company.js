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
  paymentId,
  isAutoPay,
  paymentMethod,
  certificate_of_state_registration = null,
  tax_registration_certificate = null,
  egrul_egrip_record_sheet = null,
}) {
  try {
    let findFirst = await CompanySchema.findOne({
      $or: [{ INN }, { creatorID }],
    });
    if (findFirst) return { success: false, error: "Company already exists" };

    const now = await Temporal.Now.plainDateTimeISO();
    const nextPayDay = await now
      .add({ months: 1 })
      .toPlainDate()
      .toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    const company = await new CompanySchema({
      id: v4(),
      title,
      INN,
      description,
      avatar,
      nextPayDay,
      isAutoPay,
      paymentId,
      paymentMethod,
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
    if (!user) return await { success: false, error: "User not found" };
    let saveCompany = await company.save(); // Сохранение объекта
    return await { success: true, data: saveCompany };
  } catch (error) {
    console.error("Ошибка при создании компании:", error);
    return { success: false, error: error.message || "Error" };
  }
}

let removeCompany = async (userID) => {
  try {
    const premium = await CompanySchema.findOneAndDelete({ creatorID: userID });
    return { success: true, premium };
  } catch (e) {
    console.error("Ошибка при поиске подписки:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

const updateCompany = async (id, paymentId, nextTimePay) => {
  console.log(paymentId);
  try {
    const result = await CompanySchema.findOneAndUpdate(
      { creatorID: id },
      {
        $set: {
          paymentId,
          nextPayDay: nextTimePay,
        },
      }
    );
    return { success: true, message: "Успешно обновлено", result };
  } catch (e) {
    console.error("Ошибка при обновлении подписки:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

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
async function findCompanyOfINNorTitle(text) {
  try {
    // Создаем регулярное выражение для поиска без учета регистра
    const regex = new RegExp(`(^${text}.*|.*${text}$|.*${text}.*)`, "i");

    // Выполняем поиск в базе данных
    let findFirst = await CompanySchema.find({
      $or: [{ INN: regex }, { title: regex }],
    }).select("avatar INN title");

    // Если не нашли совпадений
    if (findFirst.length === 0) {
      return { success: false, message: "Компании нет" };
    }

    // Возвращаем успешный результат с найденными данными
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
    console.log(findFirst, " - тут норм");
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

const searchCompanyForVacancy = async (creatorID) => {
  try {
    let result = await CompanySchema.findOne({ creatorID }).select(
      "INN avatar title description"
    );
    return result;
  } catch (e) {
    return false;
  }
};

module.exports = {
  createCompany,
  searchCompanyForVacancy,
  findCompanyOfINN,
  findCompanyOfUser,
  findCompanyOfUserAndINN,
  findCompanyOfINNorTitle,
  updateCompany,
  removeCompany
};
