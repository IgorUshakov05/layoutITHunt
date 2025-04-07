const { Router } = require("express");
const router = Router();
const { decodeAccessToken } = require("../api/tokens/accessToken");
const {
  getAllSubNotification,
} = require("../database/Request/SubscriptionNotification");

router.get("/inbox/other", async (req, res) => {
  let access = req.cookies.access;
  let user = await decodeAccessToken(access);
  if (!access || !user) return res.redirect("/login");
  let subscribe = await getAllSubNotification(user.userID);
  subscribe = groupByDay(subscribe.notifications) || [];
  console.log(JSON.stringify(subscribe));
  return await res.render("inboxOther", {
    isLoggedIn: !!user,
    role: user.userROLE,
    id: user.userID,
    subscribe,
    chatList: user.chatList || null,
  });
});
const groupByDay = (notifications) => {
  const grouped = {};
  let now = new Date();
  let today = `${String(now.getUTCDate()).padStart(2, "0")}-${String(
    now.getUTCMonth() + 1
  ).padStart(2, "0")}-${now.getUTCFullYear()}`;
  console.log(today);
  notifications.reverse().forEach((item) => {
    const dateObj = new Date(item.timestamp);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const dateKey = `${day}-${month}-${year}`;

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(item);
  });

  return Object.entries(grouped)
    .map(([date, notifications]) => ({ date, notifications }))
    .sort((a, b) => {
      const [d1, m1, y1] = a.date.split("-").map(Number);
      const [d2, m2, y2] = b.date.split("-").map(Number);
      return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1); // по убыванию
    })
    .map((item) => {
      if (item.date === today) {
        return { ...item, date: "Сегодня" };
      }
      return item;
    });
};
module.exports = router;
