const { Router } = require("express");
const router = Router();
const axios = require("axios");
const { isAuth } = require("../middlewares/auth");
const { v4 } = require("uuid");
const tariffsCompany = {
  5: { amount: 349, discount: "" },
  20: { amount: 1260, discount: "10%" },
  50: { amount: 2800, discount: "20%" },
  100: { amount: 4900, discount: "30%" },
  200: { amount: 9900, discount: "40%" },
};

const {
  createNewRequest,
  findCompanyOfUserAndINN,
  getCompanyByCreator,
  updateInfoCompany,
  responseToInvite,
  removeUserFromCompany,
} = require("../../database/Request/Company");
const { decodeAccessToken } = require("../tokens/accessToken");
const { body, validationResult } = require("express-validator");
const findCompany = require("./findCompanyForInvite");
const { getUserEndpoint } = require("../../database/Request/WebPush");
const sendPush = require("../web-push/push");
router.post("/leav-company", async (req, res) => {
  let access = await req.cookies.access;
  if (!access) return res.redirect("/login");

  const decodeAccess = await decodeAccessToken(access);
  if (!decodeAccess) return res.redirect("/login");

  let removeUser = await removeUserFromCompany(decodeAccess.userID);
  const payload = {
    title: removeUser.message.title,
    body: removeUser.message.body,
  };

  let endpoints = await getUserEndpoint(decodeAccess.userID);
  if (!endpoints.success) {
    return res
      .status(removeUser.success ? 201 : 404)
      .json({ success: removeUser.success });
  }

  let x = await sendPush(endpoints.data.subscriptions, payload);
  console.log(x);
  return res
    .status(removeUser.success ? 201 : 404)
    .json({ success: removeUser.success });
});
router.post(
  "/verefy-company",
  [
    body("INN")
      .isLength({ min: 9, max: 20 })
      .withMessage("INN must be between 9 and 20 characters."),
  ],
  isAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    let access = await req.cookies.access;
    if (!access) return res.redirect("/login");
    const decodeAccess = await decodeAccessToken(access);
    if (!decodeAccess) return res.redirect("/login");
    let findCompanyOfUser = await findCompanyOfUserAndINN(
      decodeAccess.userID,
      req.body.INN
    );
    console.log(findCompanyOfUser);
    if (!findCompanyOfUser.success)
      return res.status(400).json({
        success: false,
        message: "Компания с таким ИНН уже есть,или вы уже владелец компании",
      });
    return res
      .status(201)
      .json({ success: true, message: "Компания не зарегестриоована" });
  }
);

router.post(
  "/update-company",
  isAuth,
  body("title").optional({ checkFalsy: true }).isLength({ min: 3, max: 250 }),
  body("description")
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 250 }),
  body("count")
    .optional({ checkFalsy: true })
    .isIn([null, 5, 20, 50, 100, 200]),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ success: false, type: "Error", errors: errors.array() });
      }

      let { title, description, count, avatar } = req.body;

      // Проверяем, что хотя бы одно поле изменилось
      if (!title && !description && !avatar && count === null) {
        return res
          .status(202)
          .json({ success: true, type: "Error", message: "Значение пустые" });
      }

      let access = await req.cookies.access;
      if (!access) return res.redirect("/login");
      const decodeAccess = await decodeAccessToken(access);
      if (!decodeAccess) return res.redirect("/login");

      // Обработка ошибки getCompanyByCreator
      let notVerifiedCompanies = await getCompanyByCreator(decodeAccess.userID);
      if (!notVerifiedCompanies) {
        return res.status(404).json({
          success: false,
          type: "Error",
          message: "Company not found",
        });
      }

      if (!notVerifiedCompanies.success)
        return res
          .status(501)
          .json({ success: false, type: "Error", message: "Not pay" });
      if (!notVerifiedCompanies.company) return res.redirect("/");

      // Удаление старого аватара
      if (!!avatar) {
        let removeLast = await removeLastAvatar(
          notVerifiedCompanies.company.avatar.split("/")[4]
        );
        console.log(removeLast);
      }

      // Обновление информации о компании
      let updateInfo = await updateInfoCompany(decodeAccess.userID, {
        avatar,
        title,
        description,
      });

      // Проверка на необходимость оплаты
      if (
        count !== null &&
        count !== notVerifiedCompanies.company.countStaffs
      ) {
        try {
          const paymentData = {
            amount: {
              value: tariffsCompany[count].amount,
              currency: "RUB",
            },
            confirmation: {
              type: "redirect",
              return_url: `${process.env.BASE_URL}/company/${notVerifiedCompanies.company.INN}`,
            },
            capture: true,
            description: `Обновления количества сотрудников - ${count}.`,
            metadata: {
              userId: decodeAccess.userID,
              paymentType: "UpdateCompanyInfo",
              newCountStaff: count,
            },
          };
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

          if (response.status === 200) {
            const paymentId = response.data.id; // Пример: Извлечение ID платежа
            const confirmationUrl = response.data.confirmation.confirmation_url; // Пример: Извлечение URL подтверждения
            return res.status(200).json({
              success: true,
              redirect: confirmationUrl,
            });
          } else {
            console.error("Error creating payment: ", response.data);
            res
              .status(500)
              .json({ success: false, type: "Error", error: response.data });
          }
        } catch (error) {
          console.error("Error creating payment: ", error.response.data);
          res.status(500).json({
            success: false,
            type: "Error",
            error: error.response.data,
          });
        }
      } else {
        return res.status(200).json({
          success: true,
          redirect: `/company/${notVerifiedCompanies.company.INN}`,
        });
      }
    } catch (error) {
      console.error("Error getting not verified companies: ", error);
      res.status(500).json({
        success: false,
        type: "Error",
      });
    }
  }
);

router.post("/invite-company-request", async (req, res) => {
  try {
    let access = await req.cookies.access;
    let companyId = req.body.companyId;
    console.log(companyId);
    if (!companyId)
      return res.status(403).json({ success: false, message: "Введите id" });
    if (!access) return res.redirect("/login");
    const decodeAccess = await decodeAccessToken(access);
    if (!decodeAccess) return res.redirect("/login");
    let setInvite = await createNewRequest(decodeAccess.userID, companyId);
    if (!setInvite.success) return res.status(400).json(setInvite);
    const payload = {
      title: "Новая заявка на вступление в компанию",
      body: "В вашу компанию хочет вступить сотрудник",
    };
    let endpoints = await getUserEndpoint(setInvite.appendRequest.creatorID);
    if (!endpoints.success) return res.status(201).json(setInvite);
    await sendPush(endpoints.data.subscriptions, payload);
    return res.status(201).json(setInvite);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: "Error", message: "Сервер упал" });
  }
});

async function removeLastAvatar(title) {
  let deleteLastPhoto = await fetch(
    process.env.FILE_SERVER_PATH + "/avatarCompany/remove",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: title }),
    }
  );
  let response = await deleteLastPhoto.json();
  return response;
}

router.post(
  "/sendAnswerToRequest",
  [
    body("requestId").isUUID().withMessage("Не id"),
    body("answer").isBoolean().withMessage("Введите логическое значение"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res
          .status(422)
          .json({ success: false, type: "Error", errors: errors.array() });
      }
      let access = await req.cookies.access;
      if (!access) return res.redirect("/login");
      let requestId = req.body.requestId;
      let answer = req.body.answer;
      if (!requestId || answer === undefined)
        return res
          .status(403)
          .json({ success: false, message: "Введите id и ответ" });
      const decodeAccess = await decodeAccessToken(access);
      if (!decodeAccess) return res.redirect("/login");
      let updateRequest = await responseToInvite(
        decodeAccess.userID,
        requestId,
        answer
      );
      const payload = {
        title: answer
          ? "Ваша заявка на вступление принята"
          : "Ваша заявка на вступление отклонена",
        body: answer
          ? "Поздравляем! Вы были добавлены в компанию."
          : "Вашу заявку на вступление в компанию отклонил создатель компании.",
      };
      let endpoints = await getUserEndpoint(requestId);
      if (!endpoints.success) return res.status(201).json(updateRequest);
      await sendPush(endpoints.data.subscriptions, payload);
      console.log(updateRequest);
      return res.status(201).json(updateRequest);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ status: "Error", message: "Сервер упал" });
    }
  }
);

router.post(
  "/invite-company",
  [body("text").isLength({ min: 3, max: 250 }).withMessage("Min 3, Max 250")],
  isAuth,
  findCompany
);

module.exports = router;
