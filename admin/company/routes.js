const { Router } = require("express");
const {
  getNotVerefy,
  setStatusOfCompany,
} = require("../../database/Request/Company");
const {
  pushNotificationEvent,
} = require("../../database/Request/SetStatusForCompany");
const { getUserEndpoint } = require("../../database/Request/WebPush");
const sendPush = require("../../api/web-push/push");
const router = Router();
router.post("/get_all_not_verefy_company", async (req, res) => {
  try {
    const notVerifiedCompanies = await getNotVerefy(); // Assuming you have this function
    res.json({ success: true, result: notVerifiedCompanies });
  } catch (error) {
    console.error("Error getting not verified companies:", error);
    res.status(500).json({ success: false, message: "Error retrieving data" });
  }
});
router.post("/setVerefy", async (req, res) => {
  try {
    const { id, status, message } = req.body;
    if (!id) {
      return res.json({ success: false, message: "ID компании не передан" });
    }
    if (status === undefined)
      return res.json({ success: false, message: "Статус не передан" });
    console.log(status, id);
    const setStatus = await setStatusOfCompany(id, status);
    if (!setStatus.success) {
      return res.json(setStatus);
    }
    console.log(setStatus);
    const sendNotification = await pushNotificationEvent(
      setStatus.creatorID,
      status ? "access" : "cancel",
      message
    );
    const payload = {
      title: status ? "Компания была принята" : "Компания отклонена",
      body: status
        ? "Поздравляем! Ваша компания успешно добавлена. Теперь ваши сотрудники могут присоединиться и размещать вакансии от имени компании, общайтесь в чате компании и делайте объявления."
        : message,
    };
    let endpoints = await getUserEndpoint(setStatus.creatorID);
    if (!endpoints.success) {
      return await res.status(setStatus.success ? 201 : 401).json(setStatus);
    }
    let x = await sendPush(endpoints.data.subscriptions, payload);
    console.log(sendNotification);
    return await res.status(setStatus.success ? 201 : 401).json(setStatus);
  } catch (error) {
    console.error("Error getting not verified companies:", error);
    res.status(500).json({ success: false, message: "Error retrieving data" });
  }
});
module.exports = router;
