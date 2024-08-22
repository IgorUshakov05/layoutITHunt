const { Router } = require("express");
const router = Router();
const {
  setNewPremium,
  updatePremium,
  removePremium,
} = require("../../database/Request/setPremium");
const { createCompany } = require("../../database/Request/Company");

// Маршрут для обработки уведомлений от YooKassa
router.post("/webhook/yookassa", async (req, res) => {
  const notification = req.body;
  console.log(notification.event);
  console.log(notification.object);

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
      paymentType,
      title,
      nextTimePay,
      INN,
      descriptionCompany,
      companyICON,
      countStaffs,
      NU,
      registration,
      listWrite,
    },
  } = notification.object;

  if (notification.event === "payment.succeeded") {
    if (!paid) {
      // Если платёж не подтверждён, пропускаем создание подписки
      return res.json({ received: true });
    }

    try {
      if (paymentType === "premium") {
        // Обработка премиум-платежа
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
          console.error(
            "Ошибка при обновлении подписки:",
            updateResult.message
          );
        }
      } else if (paymentType === "company") {
        // Обработка платежа за создание компании
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
        console.log(
          "Платеж обработан успешно, компания создана: ",
          saveCompany
        );
      } else if (paymentType === "premium-update") {
        // Обработка обновления премиум-платежа
        const updateResult = await updatePremium(
          userId,
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
  } else {
    res.status(400).json({ error: "Unsupported event type" });
  }

  // Подтверждаем получение уведомления, если оно прошло все проверки
  res.json({ received: true });
});

module.exports = router;
