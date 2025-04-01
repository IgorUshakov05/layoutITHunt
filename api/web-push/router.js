const { Router } = require("express");
const { decodeAccessToken } = require("../tokens/accessToken");
const webPush = require("web-push");
const router = Router();
const {
  createOrAddEndpoint,
  getUserEndpoint,
} = require("../../database/Request/WebPush");
const sendPush = require("./push");
const vapidKeys = {
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
};

webPush.setVapidDetails(
  "mailto:team@webhunt.ru",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

router.post("/subscribe", async (req, res) => {
  try {
    let access = req.cookies.access;
    if (!access) return res.status(403).json({ message: "Нет доступа" });

    let decodeAccess = await decodeAccessToken(access);
    const subscription = req.body;
    if (!subscription) return res.status(404);
    console.log(decodeAccess.userID);
    let add = await createOrAddEndpoint(decodeAccess.userID, subscription);
    console.log(add);
    res.status(201).json({ message: "Подписка сохранена" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false });
  }
});

router.post("/send-notification", (req, res) => {
  const payload = {
    title: req.body.title,
    body: req.body.text,
  };
  subscriptions.forEach((subscription) => sendPush(subscription, payload));

  res.json({ message: "Уведомления отправлены" });
});

router.post("/send-notification/:id", async (req, res) => {
  const payload = {
    title: req.body.title,
    body: req.body.text,
  };
  let userID = req.params.id;
  let endpoints = await getUserEndpoint(userID);
  console.log(endpoints);
  await endpoints.data.subscriptions.forEach((subscription) =>
    sendPush(subscription, payload)
  );

  res.json({
    message: "Уведомления отправлены",
  });
});
module.exports = router;
