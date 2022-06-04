const nodemailer = require('nodemailer');

export default async function handler(req, res){
  // informações do body
  const { title, userQuestion, userQuestionEmail, userAnswer, url, emails } = req.body;

  // cria um objeto de transporte para o envio de e-mails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: userQuestionEmail,
    subject: title,
    text: `Olá ${userQuestion},\n\nO seu tópico recebeu uma resposta.\n\nAcesse o link abaixo para visualizar:\n\n${url}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}