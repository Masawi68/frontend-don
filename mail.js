"use strict";
const nodemailer = require('nodemailer');

async function notifyAdmin() {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {

        user: "edmasawi@ymail.com",
        pass: "jacbhwoqzcguzmuz",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
    const info = await transporter.sendMail({
      from: 'edmasawi@ymail.com', // sender address
      to: "pamsmonde@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
    
    })
    
    console.log("Message sent: %s", info.messageId);
   
  }
  
  async function main() {
    try {
        await notifyAdmin();
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

main();