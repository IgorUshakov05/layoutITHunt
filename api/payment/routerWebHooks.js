const { Router } = require("express");
const router = Router();
const axios = require("axios");
const {setNewPremium} = require("../../database/Request/setPremium");
const {createCompany} = require("../../database/Request/Company");

// Маршрут для обработки уведомлений от YooKassa
router.post("/webhook/yookassa", async (req, res) => {
  const notification = await req.body;
  if (notification.event === "payment.succeeded") {
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
        INN,
        descriptionCompany,
        companyICON,
        countStaffs,
        NU,
        registration,
        listWrite,
      },
    } = await notification.object;

    if (!paid) {
      res.json({ received: true });
      return;
    }

    try {
      if (paymentType === "premium") {
        // Обработка премиум-платежа
        const premiumData = await {
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
          await console.log("Премиум подписка успешно обновлена");
        } else {
          await console.error(
            "Ошибка при обновлении подписки:",
            updateResult.message
          );
        }
      } else if (paymentType === "company") {
        // Обработка платежа за создание компании
        const companyData = await {
          title,
          INN,
          description: descriptionCompany || null, // Если описание не предоставлено, установим null
          avatar: companyICON || null, // Если иконка компании не предоставлена, установим null
          creatorID: userId,
          countStaffs,
          paymentId: paymentMethodId,
          paymentMethod: paymentMethodType,
          isAutoPay,
          certificate_of_state_registration: registration || null, // Если регистрационное свидетельство не предоставлено, установим null
          tax_registration_certificate: NU || null, // Если налоговое свидетельство не предоставлено, установим null
          egrul_egrip_record_sheet: listWrite || null, // Если лист записи ЕГРЮЛ/ЕГРИП не предоставлен, установим null
        };
        let saveCompany = await createCompany(companyData);
        await console.log(
          "Платеж обработан успешно, компания создана: ",
          saveCompany
        );
      }

      await res.json({ received: true });
    } catch (error) {
      console.error("Ошибка при обработке платежа:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Unsupported event type" });
  }
});

module.exports = router;
