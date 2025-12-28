import cron from 'node-cron'
import db from './db.js';
import checkStatus from './axiosMethod.js';
console.log(`Working`)
let nodecron = cron.schedule('*/59 * * * *', async() => {
    try{
         console.log(`Search Started`)
      let   [userUrlData] = await db.query(`select user_id,url from userurls`)
      if(!userUrlData.length) return console.log(`No Urls To monitor`);
     await Promise.all(
        userUrlData.map((data)=>  checkStatus(data.url,data.user_id))
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

    // nodecron.start()