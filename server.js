const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const index = require('./pageRoutes/indexPage')
const login = require('./pageRoutes/login')
const myprofileProfessional = require('./pageRoutes/MeProfile')
const myprofileHR = require('./pageRoutes/MeHR')
const HisprofileHR = require('./pageRoutes/SeeSideHr')
const registration = require('./pageRoutes/registration')
const seeSideProf = require('./pageRoutes/seeSideProf')
const settingsHR = require('./pageRoutes/settingsHR');
const chatCompany = require('./pageRoutes/companyChat');
const createVacancy = require('./pageRoutes/createVacancy')
const addCompany = require('./pageRoutes/addCompany')
const createFastWork = require('./pageRoutes/createFastWork')
const fastWork = require('./pageRoutes/fastWork')
const fastWorkItem = require('./pageRoutes/fastworkItem')
const chat = require('./pageRoutes/chat')
const inbox = require('./pageRoutes/inbox')
const inboxOther = require('./pageRoutes/inboxOther')
const findCompany = require('./pageRoutes/findCompany')
const inboxCompany = require('./pageRoutes/inboxCompany')
const inboxFastWork = require('./pageRoutes/inboxFast-work')
const inboxVacansy = require('./pageRoutes/inboxVacansy')
const company = require('./pageRoutes/company')
const vacancia = require('./pageRoutes/vacansyaItem')
const userChat = require('./pageRoutes/privateChat')
const deleteAccount = require('./pageRoutes/deleteAccount')
const specialists = require('./pageRoutes/specialist')
const createCompany = require('./pageRoutes/createCompany')
const buyPremium = require('./pageRoutes/buyPremium');
const settingsSpecialist = require('./pageRoutes/settingsSpecialist');
const privacy = require('./pageRoutes/privacy-policy');
const vacancies = require('./pageRoutes/vacancies');
const EditCompany = require('./pageRoutes/EditCompany');


require('dotenv').config();
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'dist'));

app.use(index,buyPremium,privacy,EditCompany,login,chatCompany,myprofileProfessional,seeSideProf,inboxOther,findCompany,inboxFastWork,inboxVacansy,inboxCompany,inbox,addCompany,createVacancy,createFastWork,HisprofileHR,settingsHR,myprofileHR,registration,company,chat,vacancia,fastWorkItem,userChat,settingsSpecialist,deleteAccount,createCompany, fastWork,specialists,vacancies)
app.get('/robots.txt',(req,res)=>{
    res.sendFile(path.join(__dirname,'robots.txt'))
})

app.get('*',  (req,res) => {
    res.render('pageNotFaund')
})
start = (PORT) => {
    try {
        // mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
            // .then(() => {
                // console.log('Подключение к базе данных успешно');

                app.listen(PORT, () => {
                    console.log(`Server start ${process.env.SERVER_PORT}`);
                });
            // })
            // .catch((err) => console.error('Ошибка подключения к базе данных:', err));

    }
    catch (e) {
        console.log(e)
        process.exit(1);
    }
}
start(process.env.SERVER_PORT)
