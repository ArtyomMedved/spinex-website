const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.use(express.static('public')); // для статики, если есть

app.get('/', (req, res) => {
  res.render('index');
});

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


app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
