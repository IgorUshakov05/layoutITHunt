const { v4 } = require("uuid");
const NotificationSchema = require("../Schema/Notification");
const createNotification = async (userID, type, underType) => {
  try {
    const newNotification = new NotificationSchema({
      id: v4(),
      userID,
      type,
      read: false,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
