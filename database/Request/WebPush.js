const WebPushSchema = require("../Schema/WebPushShema");

async function createOrAddEndpoint(userID, subscription) {
  try {
    const existingSubscription = await WebPushSchema.findOne({
      userID,
      "subscriptions.endpoint": subscription.endpoint,
      "subscriptions.keys": subscription.keys,
    });

    if (existingSubscription) {
      console.log("Подписка уже существует.");
      return {
        success: false,
        message: "Подписка уже существует!",
      };
    }

    let newArr = await WebPushSchema.findOneAndUpdate(
      { userID },
      {
        $setOnInsert: { userID: userID },
        $addToSet: { subscriptions: subscription },
      },
      { new: true, upsert: true }
    );

    console.log(newArr);
    return {
      success: true,
      message: "Успех!",
    };
  } catch (e) {
    console.error("Ошибка создания WebPush коллекции:", e);
    return { success: false, message: "Не удалось создать коллекцию WebPush" };
  }
}

async function getUserEndpoint(userID) {
  try {
    let subscriptions = await WebPushSchema.findOne({ userID });
    if (!subscriptions) {
      console.log("Пользователь не найден");
      return { success: false };
    }
    return { success: true, data: subscriptions };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}
const deleteEndPoint = async (arrList) => {
  try {
    await WebPushSchema.updateMany(
      {},
      {
        $pull: {
          subscriptions: { endpoint: { $in: arrList } },
        },
      }
    );
    console.log("Успех");
  } catch (e) {
    console.error("Ошибка при удалении endpoints:", e);
  }
};

module.exports = { createOrAddEndpoint, getUserEndpoint, deleteEndPoint };
