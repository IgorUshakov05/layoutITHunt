const sendPush = require("../../api/web-push/push");
const SubscriptionNotification = require("../Schema/SubscriptionNotification");
const { getUserEndpoint } = require("./WebPush");

async function getAllSubNotification(userID) {
  try {
    let userNotification = await SubscriptionNotification.findOne({
      user_id: userID,
    });
    if (!userNotification) return { success: true, notifications: [] };
    return { success: true, notifications: userNotification.notifications };
  } catch (e) {
    return { success: false, notifications: [] };
  }
}

async function StartSubNotification(
  userID,
  status = "start",
  subscription_level,
  end_date
) {
  try {
    if (!userID) {
      return { success: false, message: "Нет userID" };
    }
    let newNotification = {
      status,
      subscription_level,
      end_date,
    };
    let pushMessage = await SubscriptionNotification.findOneAndUpdate(
      { user_id: userID },
      {
        $push: { notifications: newNotification },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log(pushMessage);
    const payload = {
      title: "Подписка оформлена!",
      body: "Вы теперь крутой!",
    };
    let endpoints = await getUserEndpoint(userID);
    if (!endpoints.success)
      return res.status(404).json({ message: "Нет токентов авторизации" });
    let send = await sendPush(endpoints.data.subscriptions, payload);

    return { success: true, message: "Успех!" };
  } catch (e) {
    return { success: false, message: "Ошибка сервера" };
  }
}

async function EndSubNotification(userID, status = "end") {
  try {
    if (!userID) {
      return { success: false, message: "Нет userID" };
    }
    let newNotification = {
      status,
    };
    let pushMessage = await SubscriptionNotification.findOneAndUpdate(
      { user_id: userID },
      {
        $push: { notifications: newNotification },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log(pushMessage);
    const payload = {
      title: "Подписка оформлена!",
      body: "Вы теперь крутой!",
    };
    let endpoints = await getUserEndpoint(userID);
    if (!endpoints.success)
      return res.status(404).json({ message: "Нет токентов авторизации" });
    let send = await sendPush(endpoints.data.subscriptions, payload);

    return { success: true, message: "Успех!" };
  } catch (e) {
    return { success: false, message: "Ошибка сервера" };
  }
}

module.exports = { StartSubNotification, getAllSubNotification };
