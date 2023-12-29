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
const fastWork = require('./pageRoutes/fastWork')
const fastWorkItem = require('./pageRoutes/fastworkItem')
const chat = require('./pageRoutes/chat')
const company = require('./pageRoutes/company')
const vacancia = require('./pageRoutes/vacansyaItem')
const userChat = require('./pageRoutes/privateChat')
const deleteAccount = require('./pageRoutes/deleteAccount')
const specialists = require('./pageRoutes/specialist')
const createCompany = require('./pageRoutes/createCompany')
const settings = require('./pageRoutes/settings');
const vacancies = require('./pageRoutes/vacancies');


require('dotenv').config();
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'dist'));

app.use(index,login,myprofileProfessional,HisprofileHR,myprofileHR,registration,company,chat,vacancia,fastWorkItem,userChat,settings,deleteAccount,createCompany, fastWork,specialists,vacancies)
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
