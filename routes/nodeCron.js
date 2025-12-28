import cron from 'node-cron'
import db from './db.js';
import checkStatus from './axiosMethod.js';
import dotenv from 'dotenv';
dotenv.config()
console.log(`Cron Job started`)
let nodecron = cron.schedule('*/59 * * * *', async () => {
    try {
        console.log(`Website Monitoring Started at ${new Date().toISOString()}`)
        let [userUrlData] = await db.query(`select user_id,url from userurls`)
        if (!userUrlData.length) return console.log(`No Urls To monitor`);
        await Promise.all(
            userUrlData.map((data) => checkStatus(data.url, data.user_id))
        )

        console.log(`Website Monitoring ended at ${new Date().toISOString()}`)
    }
    catch (err) {
        console.log(`Node-cron Error:${err.message}`)
    }

}
    ,
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });

nodecron.start()