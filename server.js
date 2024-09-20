require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const api = require("./api/authtorizationRoutes/authRoute");
const apiSkill = require("./api/Skills Offered/skillsOffered");
const index = require("./pageRoutes/indexPage");
const editVacancy = require("./pageRoutes/editVacansy");
const login = require("./pageRoutes/login");
const registration = require("./pageRoutes/registration");
const expiriens = require("./api/expiriens/routes");
const education = require("./api/education/routes");
const User = require("./pageRoutes/User");
const deleteChat = require("./api/chat/delete");
const chatCompany = require("./pageRoutes/companyChat");
const createVacancy = require("./pageRoutes/createVacancy");
const addCompany = require("./pageRoutes/addCompany");
const createFastWork = require("./pageRoutes/createFastWork");
const fastWork = require("./pageRoutes/fastWork");
const fastWorkItem = require("./pageRoutes/fastworkItem");
const chat = require("./pageRoutes/chat");
const inbox = require("./pageRoutes/inbox");
const skills = require("./api/skills/routes");
const favorite = require("./api/favorite/routes");
const inboxOther = require("./pageRoutes/inboxOther");
const findCompany = require("./pageRoutes/findCompany");
const WebSocket = require("ws");
const http = require("http");
const { handleMessageSocketConnection } = require("./api/chat/websoket/routes");
const inboxCompany = require("./pageRoutes/inboxCompany");
const court = require("./pageRoutes/court");
const inboxFastWork = require("./pageRoutes/inboxFast-work");
const inboxVacansy = require("./pageRoutes/inboxVacansy");
const companyRoute = require("./api/company/routes");
const company = require("./pageRoutes/company");
const vacancia = require("./pageRoutes/vacansyaItem");
const userChat = require("./pageRoutes/privateChat");
const deleteAccount = require("./pageRoutes/deleteAccount");
const city = require("./api/city/routes");
const payment = require("./api/payment/routes");
const createVacancyPOST = require("./api/vakancy/routes");
const createFastWorkPOST = require("./api/fastWork/routes");
const paymentHook = require("./api/payment/routerWebHooks");
const deleteAccountComplite = require("./pageRoutes/deleteAccountComplite");
const specialists = require("./pageRoutes/specialist");
const createCompany = require("./pageRoutes/createCompany");
const buyPremium = require("./pageRoutes/buyPremium");
const setting = require("./pageRoutes/Setting");
const setSetting = require("./api/setting/routes");
const moreInfo = require("./pageRoutes/moreInfo");
const privacy = require("./pageRoutes/privacy-policy");
const vacancies = require("./pageRoutes/vacancies");
const chatRouter = require("./api/chat/routes");
const EditCompany = require("./pageRoutes/EditCompany");
const googleAuthLogin = require("./api/googleAuth/login");
const googleAuthRegistration = require("./api/googleAuth/registration");

const companyADMIN = require("./admin/company/routes");

app.set("view engine", "ejs");
app.use(cookieParser());
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));
app.set("views", path.join(__dirname, "dist"));

app.use(
  session({
    secret: process.env.secretSession,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/admin", companyADMIN);
app.use(
  "/api",
  (req, res, next) => {
    if (req.headers.authorization !== "augwod89h1h9awdh9py0y82hjd")
      return res.status(401).json({ message: "Не авторизован" });
    next();
  },
  api,
  apiSkill,
  deleteChat,
  createVacancyPOST,
  expiriens,
  education,
  favorite,
  payment,
  createFastWorkPOST,
  setSetting,
  skills,
  companyRoute,
  city
);
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true }); // Используем noServer
handleMessageSocketConnection(wss);

server.on("upgrade", (request, socket, head) => {
  // Проверка на допустимый URL
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname !== "/chat") {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
app.get("/404", (req, res) => {
  res.render("pageNotFaund");
});
app.use(googleAuthLogin, googleAuthRegistration);
app.use(paymentHook);
// app.set('view cache', true);
app.use(
  buyPremium,
  EditCompany,
  deleteAccountComplite,
  chatRouter,
  editVacancy,
  court,
  chatCompany,
  inboxOther,
  findCompany,
  inboxFastWork,
  inboxVacansy,
  inboxCompany,
  inbox,
  addCompany,
  createVacancy,
  createFastWork,
  setting,
  company,
  chat,
  userChat,
  deleteAccount,
  createCompany,
  login,
  moreInfo,
  registration,
  index,
  privacy,
  vacancies,
  vacancia,
  specialists,
  fastWork,
  fastWorkItem
);

app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "robots.txt"));
});

app.use(User);

app.get("*", (req, res) => {
  res.redirect("/404");
});

start = (PORT) => {
  try {
    mongoose
      .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Подключение к базе данных успешно");

        server.listen(PORT, "0.0.0.0", () => {
          console.log(`Server start ${process.env.SERVER_PORT}`);
        });
      })
      .catch((err) => console.error("Ошибка подключения к базе данных:", err));
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
start(process.env.SERVER_PORT);
