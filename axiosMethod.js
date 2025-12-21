import axios from "axios";
import transport from './routes/mailTrapSetup.js'
import message from './routes/mailer.js'

async function minitorStatus(url) {
 await axios({
    method:'head',
    url,
  })
    .then((res) => console.log(`${url} is working`))
    .catch((err) => {message.url=url;
        transport.sendMail(message,(err,info)=>{
        if(err) console.log(`Mail not sent`);
        else console.log(`Mail sent to user`);
    })});
}


export default minitorStatus;