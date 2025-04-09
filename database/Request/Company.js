const CompanySchema = require("../Schema/Company");
const VacancySchema = require("../Schema/Vakancy");
const FastWorkSchema = require("../Schema/FastWork");
const UserSchema = require("../Schema/UserSchema");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");
const createRefund = require("../../admin/payment/refundMoney");
const Company = require("../Schema/Company");

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

    const now = await Temporal.Now.plainDateISO();
    const nextPayDay = await now.add({ months: 1 });
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

let findCourtOfUser = async (userID) => {
  try {
    const court = await CompanySchema.findOne({
      creatorID: userID,
      isVarefy: false,
    }).select("avatar title description");
    return { success: true, court };
  } catch (error) {
    console.error("Ошибка при поиске подписки:", error);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

let getCompanyByCreator = async (userID) => {
  try {
    const company = await CompanySchema.findOne({
      creatorID: userID,
      isVarefy: true,
    });
    return { success: true, company };
  } catch (error) {
    console.error("Ошибка при поиске подписки:", error);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

let findCompanyByCreator = async (userID) => {
  try {
    const company = await CompanySchema.findOne({
      creatorID: userID,
      isVarefy: true,
    }).select("avatar title description countStaffs");
    return { success: true, company };
  } catch (error) {
    console.error("Ошибка при поиске подписки:", error);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

let freezCompany = async (userID) => {
  try {
    const premium = await CompanySchema.findOneAndUpdate(
      { creatorID: userID },
      {
        isFreez: true,
      }
    );
    return { success: true, premium };
  } catch (e) {
    console.error("Ошибка при поиске подписки:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};
let updateInfoCompany = async (userID, { title, avatar, description }) => {
  try {
    const updateData = {};

    // Проверяем каждое поле и добавляем его в объект обновления, если оно не null
    if (title !== null) {
      updateData.title = title.trim();
    }
    if (avatar !== null) {
      updateData.avatar = avatar.trim();
    }
    if (description !== null) {
      updateData.description = description.trim();
    }

    // Если объект обновления пустой (никаких полей не было обновлено), ничего не делаем
    if (Object.keys(updateData).length === 0) {
      return { success: false, message: "Нет данных для обновления" };
    }
    const result = await CompanySchema.findOneAndUpdate(
      { creatorID: userID },
      {
        $set: updateData,
      }
    );
    console.log(result);
    return { success: true, message: "Успешно обновлено", result };
  } catch (e) {
    console.error("Ошибка при обновлении подписки:", e);
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
      userList: { $elemMatch: { userID: userID } },
      isVarefy: true,
      isFreez: false,
    });
    if (!findFirst) return { success: false, message: "Компании нет" };
    return { success: true, data: findFirst };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error" };
  }
}

async function removeUserFromCompany(userID) {
  try {
    const findFirst = await CompanySchema.findOne({
      userList: { $elemMatch: { userID: userID } },
      isVarefy: true,
    });
    if (!findFirst) {
      return {
        success: false,
        message: { title: "Что-то не так!", body: "Компания не найдена!" },
      };
    }
    if (findFirst.creatorID === userID) {
      return {
        success: false,
        message: {
          title: "Ошибка",
          body: "Создатель не может покинуть компанию!",
        },
      };
    }
    await findFirst.updateOne(
      {
        $pull: { userList: { userID: userID } },
      },
      { new: true }
    );
    return {
      success: true,
      message: { title: "Успех!", body: "Вы успешно покинули компанию" },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: { title: "Что-то не так!", body: "Что-то с сервером :( " },
    };
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

async function findCompanyOfINN(INN, hrID) {
  try {
    let findFirst = await CompanySchema.findOne({
      INN: INN,
      isVarefy: true,
    });
    // Проверя,явлется ли пользователь hr,если да то отрисовывать даже если под фризом
    if (findFirst.userList.some((hr) => hr.userID === hrID))
      return { success: true, data: findFirst };
    if (!findFirst || findFirst.isFreez)
      return { success: false, message: "Компании нет" };
    return { success: true, data: findFirst };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error" };
  }
}

async function getVacansyByCompanyINN(INN) {
  try {
    let findFirst = await CompanySchema.findOne({
      INN: INN,
      isVarefy: true,
    });
    let getUserID = findFirst.userList.map((user) => user.userID);
    console.log(getUserID);
    let vacansys = await VacancySchema.find({ userID: getUserID });
    return { success: true, data: vacansys };
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
    let result = await CompanySchema.findOne({
      userList: { $elemMatch: { userID: creatorID } },
      isVarefy: true,
      isFreez: false,
    }).select("INN avatar title description isFreez isActive");
    return result;
  } catch (e) {
    return false;
  }
};

const getNotVerefy = async () => {
  try {
    let result = await CompanySchema.find({
      isVarefy: false,
    });
    return result;
  } catch (e) {
    return false;
  }
};

const tariffsCompany = {
  5: { amount: 349, discount: "" },
  20: { amount: 1260, discount: "10%" },
  50: { amount: 2800, discount: "20%" },
  100: { amount: 4900, discount: "30%" },
  200: { amount: 9900, discount: "40%" },
};
const setStatusOfCompany = async (companyID, status = false) => {
  try {
    let getCompany = await CompanySchema.findOne({ id: companyID });
    if (!getCompany) return { success: false, message: "Company not found" };
    if (status === false) {
      let amount = await tariffsCompany[getCompany.countStaffs].amount;
      let payID = getCompany.paymentId;
      let refund = await createRefund(amount, payID);
      console.log(refund);
      if (refund === "succeeded") {
        await getCompany.deleteOne({ id: companyID });
        return {
          success: true,
          message: "Успех!",
          creatorID: getCompany.creatorID,
        };
      }
      return {
        success: false,
        message: "Ошибка возврата средств!",
        creatorID: getCompany.creatorID,
      };
    }
    getCompany.isVarefy = true;
    await getCompany.save();

    return {
      success: true,
      message: "Компания подтверждена!",
      creatorID: getCompany.creatorID,
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Error" };
  }
};

const updateCountStaffOfCompany = async (
  creatorID,
  newCount,
  isSave,
  paymentId,
  paymentMethod
) => {
  try {
    const now = Temporal.Now.plainDateISO();
    let result = await CompanySchema.updateOne(
      { creatorID },
      {
        $set: {
          countStaffs: newCount,
          isAutoPay: isSave,
          paymentId,
          paymentMethod,
          nextPayDay: now.add({ months: 1 }).toString(),
        },
      }
    );
    if (!result) {
      return { success: false, message: "Company not found" };
    }
    return { success: true, message: "Count staffs updated" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Error" };
  }
};

const searchRequest = async (userID) => {
  try {
    let findRequest = await Company.findOne({
      RequestList: { $elemMatch: { userID } },
    });
    console.log(findRequest);
    return { success: true, isHave: !!findRequest };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Возникла ошибка" };
  }
};

const createNewRequest = async (userRequest, INN) => {
  try {
    let findCompany = await CompanySchema.findOne({ INN });
    if (!findCompany) return { success: false, message: "Компания не найдена" };

    let findUser = await UserSchema.findOne({ id: userRequest });
    if (!findUser) return { success: false, message: "Пользователь не найден" };
    if (findUser.role !== "creatorWork")
      return { success: false, message: "Нет доступа" };
    let findCompaniesOfUser = await CompanySchema.findOne({
      userList: {
        $elemMatch: { userID: userRequest },
      },
    });
    if (findCompaniesOfUser)
      return { success: false, message: "Уже в компании" };
    // Написать нужно что пользователь не отправил заявку повторно
    let { success, isHave } = await searchRequest(userRequest);
    if (!success)
      return { success: false, message: "Возникла ошибка при запросе" };
    if (isHave)
      return {
        success: false,
        message: "Вы уже отправляли заявки на вступление",
      };
    const now = Temporal.Now.plainDateTimeISO();
    const date = new Date(now.toString());
    let appendRequest = await CompanySchema.updateOne(
      { INN },
      {
        $push: {
          RequestList: {
            id: v4(),
            userID: userRequest,
            date,
          },
        },
      }
    );

    return { success: true, appendRequest };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};
const responseToInvite = async (creatorID, userID, status) => {
  try {
    let findRequest = await CompanySchema.findOne({
      creatorID,
      RequestList: { $elemMatch: { userID } },
    });

    if (!findRequest || findRequest.RequestList.length === 0) {
      return { success: false, message: "Вам этот HR не отправлял заявку" };
    }

    if (status) {
      const accept = await CompanySchema.findOneAndUpdate(
        { creatorID },
        {
          $push: { userList: { userID } },
          $pull: { RequestList: { userID } },
        }
      );
      return { success: true, status: true, message: "Пользователь добавлен" };
    } else {
      const cancel = await CompanySchema.findOneAndUpdate(
        { creatorID },
        {
          $pull: { RequestList: { userID } },
        }
      );
      return { success: true, status: false, message: "Пользователь отклонен" };
    }
  } catch (e) {
    console.log(e);
    return { success: false, message: "Какая-то ошибка" };
  }
};

const getRequest = async (creatorID) => {
  try {
    const invites = await Company.findOne({
      creatorID,
    }).select("RequestList.userID RequestList.date");

    if (!invites || !invites.RequestList) {
      return { success: true, results: [] };
    }

    const userIDs = invites.RequestList.map((item) => item.userID);
    const users = await UserSchema.find({ id: { $in: userIDs } }).select(
      "id surname name avatar city"
    );

    const usersWithDates = invites.RequestList.map((request) => {
      let user = users.find((u) => u.id === request.userID);
      if (user) {
        // Получаем разницу во времени
        const dateObj = new Date(request.date);
        const now = new Date();
        const diffTime = Math.abs(now - dateObj);

        // Вычисляем дни, часы, минуты, секунды
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        let timeString = "";
        if (days > 0) {
          timeString = ` ${days} ${days > 1 ? "дня" : "день"} назад`;
        } else if (hours > 0) {
          timeString = `${hours} ${hours > 1 ? "часа" : "час"} назад`;
        } else if (minutes > 0) {
          timeString = `${minutes} ${minutes > 1 ? "минуты" : "минута"} назад`;
        } else {
          timeString = `${seconds} ${
            seconds > 1 ? "секунды" : "секунда"
          } назад`;
          var seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
          console.log(timeString);
        }

        return { ...user._doc, date: timeString };
      } else {
        return null;
      }
    });

    const filteredUsersWithDates = usersWithDates.filter(
      (user) => user !== null
    );

    return { success: true, results: filteredUsersWithDates };
  } catch (e) {
    console.error(e);
    return { success: false, results: null };
  }
};

module.exports = {
  getRequest,
  createCompany,
  searchCompanyForVacancy,
  findCompanyOfINN,
  findCompanyOfUser,
  findCompanyByCreator,
  setStatusOfCompany,
  responseToInvite,
  updateCountStaffOfCompany,
  createNewRequest,
  findCourtOfUser,
  getCompanyByCreator,
  findCompanyOfUserAndINN,
  getNotVerefy,
  findCompanyOfINNorTitle,
  updateCompany,
  updateInfoCompany,
  getVacansyByCompanyINN,
  freezCompany,
  removeUserFromCompany,
};
