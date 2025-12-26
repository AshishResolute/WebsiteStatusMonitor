import axios from 'axios'
import db from './db.js';
let checkStatus = async(url,user_id)=>{
  axios({
    method:'head',
    url
  }).then(async(res)=>{
      await db.query(`insert into websitestatus(user_id,url,status,time) values(?,?,?,?)`,[user_id,url,"Up",new Date().toISOString().slice(0, 19).replace('T', ' ')])
  })
  .catch(async(err)=>{
     await db.query(`insert into websitestatus(user_id,url,status,time) values(?,?,?,?)`,[user_id,url,"Down",new Date().toISOString().slice(0, 19).replace('T', ' ')])
  })
}


export default checkStatus;