const webPush = require("web-push");
const { deleteEndPoint } = require("../../database/Request/WebPush");
let sendSub = async (subscriptionItem, subject) => {
  return await webPush.sendNotification(
    subscriptionItem,
    JSON.stringify(subject)
  );
};
let sendPush = (subscription, subject) => {
  try {
    return Promise.allSettled(
      subscription.map((item) => sendSub(item, subject))
    )
      .then((results) => {
        let arrError = results
          .map((item) => {
            if (item.status === "rejected") return item.reason.endpoint;
          })
          .filter((item) => item !== undefined);
        return arrError;
      })
      .then((errors) => {
        if (errors.length) deleteEndPoint(errors);
        return { success: true };
      });
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};
module.exports = sendPush;
