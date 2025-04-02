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
  // subscriptions.forEach((subscription) => sendPush(subscription, payload));

  res.json({ message: "Уведомления отправлены" });
});

router.post("/send-notification/:id", async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      body: req.body.text,
    };
    let userID = req.params.id;
    let endpoints = await getUserEndpoint(userID);
    if (!endpoints.success)
      return res.status(404).json({ message: "Нет токентов авторизации" });
    let x = await sendPush(endpoints.data.subscriptions, payload);
    console.log(x);
    return await res.status(201).json({
      message: "Уведомления отправлены",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});
module.exports = router;
