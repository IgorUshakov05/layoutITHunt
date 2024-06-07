const nodemailer = require("nodemailer");
// Import NodeMailer (after npm install)

async function sendCode({userPost,code,username}) {
    let html = `<!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <style>
       @font-face {
          font-family: 'Rockstar';
          src: url('cid:rockstarFont') format('truetype');
      }
    
            body {
                margin: 0;
                padding: 0;
                font-family: "Raleway", sans-serif;
            }
            .body {
                border-radius: 20px;
                background: white;
                width: 90%;
                margin: auto;
                padding: 36px 54px;
                margin-top: 50px;
                box-sizing: border-box;
                box-shadow: 0 2px 17px -8px #5412e0;
            }
            h1 {
                font-weight: 600;
                font-size: 25px;
                margin-top: 40px;
                color: #000;
            }
            
           
            p {
                font-weight: 400;
                font-size: 16px;
                margin-top: 15px;
                line-height: 121%;
                color: #000 !important;
            }
           
            .code {
                color: white !important;
                background: #4900e3  !important;
                border-radius: 8px  !important;
                padding: 15px 20px !important ;
                font-family: 'Rockstar', sans-serif  !important;
                letter-spacing: 3px  !important;
                font-weight: 700  !important;
                font-size: 27px  !important;
            }
            .center {
                text-align: center;
                margin-left: 30px;
            }
            .ml {
                margin-left: 20px;
                margin-top: 20px;
            }
            .m23 {
                margin-top: 23px;
            }
            .twoBlocks {
                margin-top: 20px;
                display: flex;
                width: fit-content;
                align-items: center;
                justify-content: space-between;
            }
            .twoBlocks .block {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .twoBlocks .block img {
                margin-left: 10px;
            }
            .twoBlocks .blocka {
                display: flex;
                flex-direction: column;
            }
            .blockBlock {
              display: block;
            
            }
            .blockBlock > * {
              display: block;
    
            }
            .p0 {
              padding: 0;
              margin-bottom: 0;
            }
            .w100 {
              width: 100% !important;
            }
            @media (max-width: 700px) {
              .code {
                width: 100%;
              }
              .body {
                padding: 14px;
              }
              .ml {
                display: none;
              }
             }
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    </head>
    <body>
    <div class="body">
        <header>
             <center>
               <img src="cid:logo" width="200" alt="Изображение">
             </center>
        </header>
        <h1>Подтверждение регистрации</h1>
        <p>Здравствуйте, ${username}</p>
        <p class="m23">Спасибо за регистрацию на нашем сайте. Для завершения процесса необходимо подтвердить вашу почту.</p>
        <p>Пожалуйста, введите следующий код на сайте:</p>
        <center>
        <div class="twoBlocks">
        <div class="code w100">${code}</div>
        </div>
        </center>
    
        <div class="twoBlocks w100">
            <div class="w100">
                <p class="p0">С уважением,</p>
                <p class="p0">Команда поддержки <a href="https://webhunt.ru">WebHunt</a></p>
            </div>
            <div class="blocka center m23" >
                <a href="https://telegram.org/"><img width="35" src="cid:telegram"></a>
                <a style="margin-left: 30px;" href="https://vk.com"><img width="35" src="cid:vk"></a>
            </div>
        </div>
    </div>
    </body>
    </html>
    `;
  // Async function enables allows handling of promises with await

  // First, define send settings by creating a new transporter:
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.ru", // SMTP server address (usually smtp.your-domain.com)
    port: 465, // SMTP port (usually 465 or 587)
    secure: true, // Use a secure connection (TLS or SSL)
    auth: {
      user: "team@webhunt.ru",
      pass: "rn434CgTa8kDL0cbszKx",
    },
  });

  // Define and send message inside transporter.sendEmail() and await info about send from promise:
  let info = await transporter.sendMail({
    from: '"WebHunt" <team@webhunt.ru>',
    to: userPost,
    subject: "Подтвердите регистрацию аккаунта",
    html,
    attachments: [
      {
        filename: "image.png",
        path: "./assets/logo.png",
        cid: "logo", // уникальный идентификатор для изображения
      },
      {
        filename: "image3.png",
        path: "./assets/vk.png",
        cid: "vk", // уникальный идентификатор для изображения
      },
      {
        filename: "image4.png",
        path: "./assets/telegram.png",
        cid: "telegram", // уникальный идентификатор для изображения
      },
    ],
  });

  console.log(info.messageId); // Random ID generated after successful send (optional)
}


module.exports = {sendCode}
sendCode({userPost:'igorushakov111@gmail.com',code:'237194',username: "Игорь"})