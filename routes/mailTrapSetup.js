import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


let transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transport.verify((err, info) => {
  if (err) console.log(`MailTrap SMTP not connected`)
  else console.log(`MailTrap SMTP server connected`);
})

export default transport;