const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.use(express.static('public')); // для статики, если есть

// Маршрут для отображения главной страницы
app.get('/', async (req, res) => {
  // Получаем данные о прогрессе сбора средств
  const progress = await fetchProgressData();
  
  // Передаем данные в шаблон index.ejs
  res.render('index', { progress });
});

// Функция для парсинга данных с Tinkoff
async function fetchProgressData() {
  try {
    const url = 'https://www.tbank.ru/cf/4pMdZ3NB4qa'; // URL страницы сбора
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Извлекаем собранную сумму и цель
    const collected = $('.CrowdInfo__progressValue_ObV9U .Money-module__money_UZBbh').first().text().replace(/\D/g, '');
    const target = $('.CrowdInfo__progressValue_ObV9U .Money-module__money_UZBbh').last().text().replace(/\D/g, '');

    return { collected, target };
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return { collected: 0, target: 100000 }; // Возвращаем значения по умолчанию в случае ошибки
  }
}

// Маршрут для отправки email
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com', // или smtp.apple.mail.com
    port: 587, // или 465 для SSL
    secure: false, // true для 465
    auth: {
      user: 'medvedevartyom08@icloud.com',
      pass: 'zgnj-eaff-xtfl-yslr' // ваш пароль приложения
    }
  });

  const mailOptions = {
    from: 'medvedevartyom08@icloud.com', // Ваш адрес почты
    to: 'medvedevartyom08@icloud.com',
    subject: `Новое сообщение от ${name}`,
    text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send('Ошибка при отправке сообщения.');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Сообщение успешно отправлено.');
    }
  });
});

// Запуск сервера
app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
});
