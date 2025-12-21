import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

let transport = nodemailer.createTransport({
    host:process.env.MAILER_HOST,
    port:process.env.MAILER_PORT,
    auth:{
      user:process.env.MAIL_USER,
      pass:process.env.MAILER_PASS
    }
})

transport.verify((err,info)=>{
    if(err) console.log(`MailTrap SMTP not connected`)
        else console.log(`MailTrap SMTP server connected`);
})

export default transport;