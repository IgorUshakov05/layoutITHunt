const axios = require("axios");

// Функция для создания подписки
const createPayment = async (amuntValue, paymentMethodId) => {
    const idempotenceKey = v4(); // Генерация уникального ключа идемпотентности
  
    try {
      const response = await axios.post(
        "https://api.yookassa.ru/v3/payments",
        {
          amount: {
            value: amuntValue,
            currency: "RUB",
          },
          capture: true,
          payment_method_id: paymentMethodId,
          description: "Заказ №37",
        },
        {
          auth: {
            username: process.env.SHOPID,
            password: process.env.SECRETKEY,
          },
          headers: {
            "Idempotence-Key": idempotenceKey,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Payment response:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Сервер вернул ответ с кодом статуса, который не находится в диапазоне 2xx
        console.error("Error response from server:", error.response.data);
      } else if (error.request) {
        // Запрос был сделан, но ответа не было получено
        console.error("No response received:", error.request);
      } else {
        // Произошла ошибка при настройке запроса
        console.error("Error setting up the request:", error.message);
      }
      throw error;
    }
  };
  
