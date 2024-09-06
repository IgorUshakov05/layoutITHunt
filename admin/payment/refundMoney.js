const axios = require("axios");

const { v4 } = require("uuid");
const createRefund = async (amount, payID) => {
  try {
    const response = await axios.post(
      "https://api.yookassa.ru/v3/refunds",
      {
        payment_id: payID,
        amount: {
          value: amount,
          currency: "RUB",
        },
      },
      {
        headers: {
          "Idempotence-Key": v4(),
          "Content-Type": "application/json",
        },
        auth: {
          username: process.env.SHOPID,
          password: process.env.SECRETKEY,
        },
        metadata:{
          types:"Refund", 
        } 
      }
    );
    console.log("Refund created successfully:", response.data);
    return response.data.status;
  } catch (error) {
    console.error(
      "Error creating refund:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};
module.exports = createRefund;
