const webPush = require("web-push");

let sendPush = (subscription, subject) => {
  webPush
    .sendNotification(subscription, JSON.stringify(subject))
    .catch((err) => console.error(err));
};
module.exports = sendPush;
