const { Router } = require("express");
const router = Router();
const axios = require("axios");
let { decodeAccessToken } = require("../tokens/accessToken");
const { isAuth } = require("../middlewares/auth");
const { body, validationResult } = require("express-validator");
const { v4 } = require("uuid");
const { findCompanyOfUserAndINN } = require("../../database/Request/Company");
const createPayment = require("./autoPay");
const tariffs = {
  short: {
    amount: "299.00",
    description: "Шорт",
  },
  middle: {
    amount: "807.00",
    description: "Миддл",
  },
  long: {
    amount: "2870.00",
    description: "Лонг",
  },
};

router.post("/create-payment", isAuth, async (req, res) => {
  let { userID } = decodeAccessToken(req.cookies.access);
  console.log(userID);
  const { tariff } = await req.body;
  console.log(tariff);
  if (!tariffs[tariff]) {
    return res.status(400).json({ error: "Invalid tariff" });
  }

  const paymentData = {
    amount: {
      value: tariffs[tariff].amount,
      currency: "RUB",
    },
    confirmation: {
      type: "redirect",
      return_url: `${process.env.BASE_URL}/${userID}`,
    },
    capture: true,
    description: tariffs[tariff].description,
    metadata: {
      userId: userID,
      paymentType: "premium",
    },
  };

  try {
    const response = await axios.post(
      "https://api.yookassa.ru/v3/payments",
      paymentData,
      {
        auth: {
          username: process.env.SHOPID,
          password: process.env.SECRETKEY,
        },
        headers: {
          "Idempotence-Key": v4(),
        },
      }
    );
    console.log(response.data);
    return await res.status(201).json(response.data);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

const tariffsCompany = {
  5: { amount: 349, discount: "" },
  20: { amount: 1260, discount: "10%" },
  50: { amount: 2800, discount: "20%" },
  100: { amount: 4900, discount: "30%" },
  200: { amount: 9900, discount: "40%" },
};

router.post(
  "/create-payment-company",
  isAuth,
  [
    body("title")
      .isLength({ min: 3, max: 250 })
      .withMessage("Title must be between 3 and 250 characters."),
    body("INN")
      .isLength({ min: 9, max: 20 })
      .withMessage("INN must be between 9 and 20 characters."),
    body("description")
      .isLength({ min: 5, max: 250 })
      .withMessage("Description must be between 5 and 250 characters."),
  ],
  async (req, res) => {
    let { userID } = decodeAccessToken(req.cookies.access);
    const {
      title,
      INN,
      description,
      companyICON,
      countStaffs,
      NU,
      registration,
      listWrite,
    } = req.body;
    // Проверка результатов валидации
    const errors = validationResult(req);
    if (!errors.isEmpty() || !tariffsCompany[countStaffs]) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    // Формирование данных для платежа
    let copmanyIsCreated = await findCompanyOfUserAndINN(userID, INN);
    if (!copmanyIsCreated.success) {
      return res
        .status(409)
        .json({ message: "Компания с таким ИНН уже существует" });
    }
    const paymentData = {
      amount: {
        value: tariffsCompany[countStaffs].amount,
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.BASE_URL}/${userID}`,
      },
      capture: true,
      description: `Оплата ${countStaffs} количества сотрудников. СкидкаА: ${
        tariffsCompany[countStaffs].discount || "0%"
      }`,
      metadata: {
        userId: userID,
        paymentType: "company",
        title,
        INN,
        descriptionCompany: description,
        companyICON,
        countStaffs,
        NU,
        registration,
        listWrite,
      },
    };

    try {
      const response = await axios.post(
        "https://api.yookassa.ru/v3/payments",
        paymentData,
        {
          auth: {
            username: process.env.SHOPID,
            password: process.env.SECRETKEY,
          },
          headers: {
            "Idempotence-Key": v4(),
          },
        }
      );
      console.log(response.data);
      return res.status(201).json(response.data);
    } catch (error) {
      console.error("Error creating payment:", error.response.data);
      res.status(500).json({ error: error.response.data });
    }
  }
);

router.post("/auto-payment", isAuth, async (req, res) => {
  try {
    let isPay = await createPayment(req.body.amount, req.body.paymentMethodId);
    console.log(isPay);
    if (isPay) {
      return res.status(200).json({ message: "Payment successful" });
    } else {
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
