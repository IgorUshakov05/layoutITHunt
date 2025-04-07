const Company = require("../Schema/Company");
const CompanyStatusNotification = require("../Schema/CompanyStatusNotification");
const UserSchema = require("../Schema/UserSchema");

async function pushNotificationEvent(creatorID, status, message) {
  try {
    console.log("Начало добавления уведомления");
    let findUser = await UserSchema.findOne({ id: creatorID });
    if (!findUser) return { success: false, message: "Компания не найдена" };

    let findCompany = await Company.findOne({ creatorID });
    console.log(findCompany)
    if (!findCompany) return { success: false, message: "Компания не найдена" };

    let newPush = {
      status,
    };
    if (message) newPush.message = message;

    let pushMessage = await CompanyStatusNotification.findOneAndUpdate(
      { creator_id: creatorID },
      {
        $push: { notifications: newPush },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log(pushMessage);
    return { success: true, message: "Успех!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Ошибка сервера" };
  }
}

module.exports = { pushNotificationEvent };
