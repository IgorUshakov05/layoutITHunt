const { Temporal } = require("@js-temporal/polyfill");
const PremiumScheme = require("../../database/Schema/premium");
const UserScheme = require("../../database/Schema/UserSchema");

const setNewPremium = async (
  id,
  { typePremium, typePay, amount, paymentId, paymentMethod, timePay, save }
) => {
  try {
    // Вычисляем дату следующего списания
    const now = Temporal.Now.plainDateISO();
    let nextTimePay;
    switch (typePremium) {
      case "Шорт":
        nextTimePay = now.add({ months: 1 });
        break;
      case "Миддл":
        nextTimePay = now.add({ months: 3 });
        break;
      case "Лонг":
        nextTimePay = now.add({ years: 1 });
        break;
      default:
        throw new Error("Invalid typePremium value");
    }

    // Форматируем дату в ДД-ММ-ГГГГ
    const formattedNextTimePay = nextTimePay.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const result = await PremiumScheme.findOneAndUpdate(
      { userID: id },
      {
        $set: {
          typePremium,
          typePay,
          amount,
          paymentId,
          paymentMethod,
          timePay,
          save,
          nextTimePay: formattedNextTimePay,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { success: true, message: "Успешно обновлено или создано", result };
  } catch (e) {
    console.error("Ошибка при обновлении подписки:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

const updatePremium = async (id, paymentId, nextTimePay) => {
  console.log(paymentId);
  try {
    const result = await PremiumScheme.findOneAndUpdate(
      { userID: id },
      {
        $set: {
          paymentId,
          nextTimePay,
        },
      }
    );
    return { success: true, message: "Успешно обновлено", result };
  } catch (e) {
    console.error("Ошибка при обновлении подписки:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

let findPremium = async (userID) => {
  try {
    const premium = await PremiumScheme.findOne({ userID });
    return { success: true, premium };
  } catch (e) {
    console.error("Ошибка при поиске подписки:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

let removePremium = async (userID) => {
  try {
    const premium = await PremiumScheme.findOneAndDelete({ userID });
    return { success: true, premium };
  } catch (e) {
    console.error("Ошибка при поиске подписки:", e);
    return { success: false, message: "Произошла ошибка, попробуйте позже" };
  }
};

module.exports = { setNewPremium, findPremium, updatePremium, removePremium };
