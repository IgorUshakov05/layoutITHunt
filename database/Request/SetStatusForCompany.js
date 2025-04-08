const Company = require("../Schema/Company");
const CompanyStatusNotification = require("../Schema/CompanyStatusNotification");
const UserSchema = require("../Schema/UserSchema");

async function pushNotificationEvent(creatorID, status, message) {
  try {
    console.log("Начало добавления уведомления");
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

async function getAllComNotification(userID) {
  try {
    let userNotification = await CompanyStatusNotification.findOne({
      creator_id: userID,
    });
    if (!userNotification) return { success: true, notifications: [] };
    return { success: true, notifications: userNotification.notifications };
  } catch (e) {
    return { success: false, notifications: [] };
  }
}

module.exports = { pushNotificationEvent, getAllComNotification };
