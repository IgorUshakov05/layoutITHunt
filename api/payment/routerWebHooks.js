const { Router } = require("express");
const router = Router();
const axios = require("axios");
const setNewPremium = require('../../database/Request/setPremium');

// Маршрут для обработки уведомлений от YooKassa
router.post("/webhook/yookassa", async (req, res) => {
  const notification = req.body;
  console.log(notification);

  // Проверка наличия необходимых данных в уведомлении
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
      metadata: { userId },
    } = notification.object;
    console.log(amount);
    console.log(paymentMethodId);
    console.log(paymentMethodType);
    console.log(userId);
    console.log(isAutoPay ? "Автоплатеж" : "Неавтоплатеж");

    if (!paid) {
      res.json({ received: true });
      return; // Завершаем выполнение запроса, если платеж не прошел
    }

    // Обновляем данные о подписке пользователя в базе данных
    const premiumData = {
      typePremium:  description,
      typePay: paymentMethodType,
      amount: amount.value,
      paymentId: paymentMethodId,
      paymentMethod: paymentMethodType,
      timePay: new Date().toISOString(),
      save: isAutoPay,
    };

    try {
      const updateResult = await setNewPremium(userId, premiumData);
      if (updateResult.success) {
        console.log("Премиум подписка успешно обновлена");
      } else {
        console.error("Ошибка при обновлении подписки:", updateResult.message);
      }
    } catch (error) {
      console.error("Ошибка при обновлении подписки:", error);
    }

    res.json({ received: true });
  } else {
    // В случае других событий можно также обработать их или проигнорировать
    res.status(400).json({ error: "Unsupported event type" });
  }
});

module.exports = router;
