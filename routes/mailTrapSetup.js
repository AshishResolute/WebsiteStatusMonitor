import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
// dotenv.config()


var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "58124207766ea7",
    pass: "ca26ba71144564"
  }
});

transport.verify((err,info)=>{
    if(err) console.log(`MailTrap SMTP not connected`)
        else console.log(`MailTrap SMTP server connected`);
})

export default transport;