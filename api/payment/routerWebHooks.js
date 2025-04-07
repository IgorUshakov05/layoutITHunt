const { Router } = require("express");
const router = Router();
const {
  setNewPremium,
  updatePremium,
  removePremium,
} = require("../../database/Request/setPremium");
const {
  pushNotificationEvent,
} = require("../../database/Request/SetStatusForCompany");
const {
  createCompany,
  updateCompany,
  updateCountStaffOfCompany,
  freezCompany,
} = require("../../database/Request/Company");
const {
  StartSubNotification,
} = require("../../database/Request/SubscriptionNotification");
const { getUserEndpoint } = require("../../database/Request/WebPush");
const sendPush = require("../web-push/push");

// Маршрут для обработки уведомлений от YooKassa
router.post("/webhook/yookassa", async (req, res) => {
  try {
    const notification = req.body;
    const {
      amount,
      paid,
      description,
      payment_method: {
        id: paymentMethodId,
        saved: isAutoPay,
        type: paymentMethodType,
      },
      metadata: {
        userId,
        creatorID,
        paymentType,
        title,
        nextTimePay,
        newCountStaff,
        INN,
        descriptionCompany,
        companyICON,
        countStaffs,
        NU,
        registration,
        listWrite,
      },
    } = notification.object;
    console.log(paid);
    if (notification.event === "payment.succeeded") {
      if (!paid) {
        // Если платёж не подтверждён, пропускаем создание подписки
        return res.json({ received: true });
      }

      try {
        if (paymentType === "premium") {
          const premiumData = {
            typePremium: description,
            typePay: paymentMethodType,
            amount: amount.value,
            timePay: new Date().toISOString(),
            paymentId: paymentMethodId,
            paymentMethod: paymentMethodType,
            save: isAutoPay,
          };
          const updateResult = await setNewPremium(userId, premiumData);

          if (updateResult.success) {
            console.log("Премиум подписка успешно создана");
          } else {
            console.error("Ошибка создании подписки:", updateResult.message);
          }
          const sendNotification = await StartSubNotification(
            userId,
            "start",
            description,
            updateResult.result.nextTimePay
          );
          console.log(sendNotification);
        } else if (paymentType === "company") {
          const companyData = {
            title,
            INN,
            description: descriptionCompany || null,
            avatar: companyICON || null,
            creatorID: userId,
            countStaffs,
            paymentId: paymentMethodId,
            paymentMethod: paymentMethodType,
            isAutoPay,
            certificate_of_state_registration: registration || null,
            tax_registration_certificate: NU || null,
            egrul_egrip_record_sheet: listWrite || null,
          };
          let saveCompany = await createCompany(companyData);
          console.log("Платеж обработан успешно, компания создана");
          if (saveCompany.success) {
            await pushNotificationEvent(userId, "requset");
            const payload = {
              title: "Заявка отправлена!",
              body: "Мы скоро сообщим свое решение",
            };
            let endpoints = await getUserEndpoint(userId);
            if (!endpoints.success)
              return res
                .status(404)
                .json({ message: "Нет токентов авторизации" });
            await sendPush(endpoints.data.subscriptions, payload);
          }
        } else if (paymentType === "premium-update") {
          // Обработка обновления премиум-платежа
          const updateResult = await updatePremium(
            userId,
            paymentMethodId,
            nextTimePay
          );
          if (updateResult.success) {
            console.log("Премиум подписка успешно обновлена");
            await StartSubNotification(
              userId,
              "start",
              description,
              updateResult.result.nextTimePay
            );
          } else {
            console.error(
              "Ошибка при обновлении подписки:",
              updateResult.message
            );
          }
        } else if (paymentType === "company-update") {
          // Обработка обновления премиум-платежа
          const updateResult = await updateCompany(
            creatorID,
            paymentMethodId,
            nextTimePay
          );
          if (updateResult.success) {
            console.log("Премиум подписка успешно обновлена");
          } else {
            console.error(
              "Ошибка при обновлении подписки:",
              updateResult.message
            );
          }
        } else if (paymentType === "UpdateCompanyInfo") {
          let staffs = Number(newCountStaff);
          console.log(isAutoPay, paymentMethodId, " - нужно добавить");
          let updateCompanyInfo = await updateCountStaffOfCompany(
            userId,
            staffs,
            isAutoPay,
            paymentMethodId,
            paymentMethodType
          );
          if (!updateCompanyInfo.success) {
            console.error(
              "Ошибка при изменении количества сотрудников компании:",
              updateCompanyInfo.message
            );
            return res.status(500).json({ error: "Internal Server Error" });
          }
        }
        return res.json({ received: true });
      } catch (error) {
        console.error("Ошибка при обработке платежа:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (notification.event === "payment.canceled") {
      if (paymentType === "premium-update") {
        try {
          let removePremiumUser = await removePremium(userId);
          console.log("Премиум подписка успешно отменена", removePremiumUser);
          return res.json({ received: true });
        } catch (error) {
          console.error("Ошибка при отмене подписки:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }
      if (paymentType === "company-update") {
        try {
          let freezCompanyResult = await freezCompany(creatorID);
          console.log(
            "Заморозка компании из-за недостатка средств",
            freezCompanyResult
          );
          return res.json({ received: true });
        } catch (error) {
          console.error("Ошибка при отмене подписки:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }
    } else {
      return res.status(400).json({ error: "Unsupported event type" });
    }

    return res.json({ received: true });
  } catch (e) {
    console.log(e);
    return res.json({ received: true });
  }
});

module.exports = router;
