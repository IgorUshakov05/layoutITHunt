const { Router } = require("express");
const router = Router();
const axios = require("axios");
let { decodeAccessToken } = require("../tokens/accessToken");
const { isAuth } = require("../middlewares/auth");
const { v4 } = require("uuid");

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
      userId:userID,
    }
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

module.exports = router;
