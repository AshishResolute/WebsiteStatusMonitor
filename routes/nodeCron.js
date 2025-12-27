import cron from 'node-cron'
import db from './db.js';
import checkStatus from './axiosMethod.js';
let nodecron = cron.schedule('*/2 * * * *', async() => {
    try{
             console.log(`Search Started`)
      let   [userUrlData] = await db.query(`select user_id,url from userurls`)
      if(!userUrlData.length) return console.log(`No Urls To monitor`);
     await Promise.all(
        userUrlData.map(async(data)=> await checkStatus(data.url,data.user_id))
     )
      
       console.log(`Search Ended`) 
    }
    catch(err)
    {
        console.log(`Node-cron Error:${err.message}`)
    }
 
}
    ,
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    }); 