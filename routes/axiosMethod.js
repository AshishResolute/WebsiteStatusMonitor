import axios from 'axios'
import db from './db.js';
import transport from './mailTrapSetup.js';
import message from './mailer.js'
let checkStatus = async (url, user_id) => {
  axios({
    method: 'head',
    url,
    timeout:10000
  }).then(async (res) => {
    console.log(`${url} is Up`)
    let [lastStatus] = await db.query(`select status from websitestatus where url=$1 order by time desc limit 1`, [url])
    if(lastStatus.length&&lastStatus[0].status==='Down')
    {
      let [userAddress] = await db.query(`select email from users where id=$1`, [user_id])
      transport.sendMail(message(userAddress[0].email, url, "Up"), (err, info) => {
          if (err) return console.log(`Mail Not sent due to ${err.message}`)
          console.log(`Mail Sent to user`)
        })
        await db.query(`insert into websitestatus(user_id,url,status,time) values($1,$2,$3,$4)`, [user_id, url, "Up", new Date().toISOString().slice(0, 19).replace('T', ' ')])
    }
    else if(!lastStatus.length) {
        await db.query(`insert into websitestatus(user_id,url,status,time) values($1,$2,$3,$4)`, [user_id, url, "Up", new Date().toISOString().slice(0, 19).replace('T', ' ')])
    }
     
  })
    .catch(async (err) => {
      console.log(`${url} is currently Down`)
      let [lastStatus] = await db.query(`select status from websitestatus where url=$1 order by time desc limit 1`, [url])
      let [userAddress] = await db.query(`select email from users where id=$1`, [user_id])
      if (lastStatus.length&&lastStatus[0].status !== "Down") {
        transport.sendMail(message(userAddress[0].email, url, "Down"), (err, info) => {
          if (err) return console.log(`Mail Not sent due to ${err.message}`)
          console.log(`Mail Sent to user`)
        })
         await db.query(`insert into websitestatus(user_id,url,status,time) values($1,$2,$3,$4)`, [user_id, url, "Down", new Date().toISOString().slice(0, 19).replace('T', ' ')]);
      }
      else if(!lastStatus.length) {
        transport.sendMail(message(userAddress[0].email, url, "Down"), (err, info) => {
          if (err) return console.log(`Mail Not sent due to ${err.message}`)
          console.log(`Mail Sent to user`)
        })
        await db.query(`insert into websitestatus(user_id,url,status,time) values($1,$2,$3,$4)`, [user_id, url, "Down", new Date().toISOString().slice(0, 19).replace('T', ' ')]);
      }
      else{
        console.log(`Avoided sending Spam messages`)
      }

     
    })
}


export default checkStatus;