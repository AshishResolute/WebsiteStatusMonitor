import axios from 'axios'
import db from './db.js';
import transport from './mailTrapSetup.js';
import message from './mailer.js'
let checkStatus = async (url, user_id) => {
  axios({
    method: 'head',
    url
  }).then(async (res) => {
    console.log(url, user_id)
    let [lastStatus] = await db.query(`select status from websitestatus where url=? order by time desc limit 1`, [url])
    if(lastStatus[0].status==='Down'&&lastStatus[0])
    {
      let [userAddress] = await db.query(`select email from users where id=?`, [user_id])
      transport.sendMail(message(userAddress[0].email, url, "Up"), (err, info) => {
          if (err) return console.log(`Mail Not sent due to ${err.message}`)
          console.log(`Mail Sent to user`)
        })
        await db.query(`insert into websitestatus(user_id,url,status,time) values(?,?,?,?)`, [user_id, url, "Up", new Date().toISOString().slice(0, 19).replace('T', ' ')])
    }
     
  })
    .catch(async (err) => {
      console.log(url, user_id)
      let [lastStatus] = await db.query(`select status from websitestatus where url=? order by time desc limit 1`, [url])
      let [userAddress] = await db.query(`select email from users where id=?`, [user_id])
      if (lastStatus[0].status !== "Down"&&lastStatus[0]) {
        transport.sendMail(message(userAddress[0].email, url, "Down"), (err, info) => {
          if (err) return console.log(`Mail Not sent due to ${err.message}`)
          console.log(`Mail Sent to user`)
        })
         await db.query(`insert into websitestatus(user_id,url,status,time) values(?,?,?,?)`, [user_id, url, "Down", new Date().toISOString().slice(0, 19).replace('T', ' ')]);
      }
      else{
        console.log(`Avoided sending Spam messages`)
      }

     
    })
}


export default checkStatus;