import axios from "axios";
import transport from './mailTrapSetup.js';
import db from './db.js';
async function minitorStatus(url) {
  await axios({
    method: 'head',
    url,
  })
    .then(async (res) => {
      let [status] = await db.query(`select status from websitestatustracker where url=? order by time desc limit 1`,[url]);
      if(status[0].status==='Down')
      {
        const message = {
        from: 'Ashish@Backend.dev',
        to: 'cynthia@pkmn.com',
        url,
        subject: `Website ${url} is Active again`,
        html: `<p> Currently ${url} is active now u can access it  <p/>`
      }

      transport.sendMail(message, (err, info) => {
        if (err) console.log(`Mail not sent`);
        else console.log(`Mail sent to user`);
      })
      }
      await db.query(`insert into websitestatustracker (url,status,time) values(?,?,?)`,[url,'up',new Date()]);
      
      console.log(`${url} is working`)
    })
    .catch(async (err) => {
      const message = {
        from: 'Ashish@Backend.dev',
        to: 'cynthia@pkmn.com',
        url,
        subject: `Website ${url}  not working`,
        html: `<p> Currently ${url} isnt working dont access it untill u get a confirmation message when the website is up/active <p/>`
      }
      let [websiteData] = await db.query(`select status,time from websitestatustracker where url=? order by time desc limit 1`,[url]);
      let timeDiff = new Date() - new Date(websiteData[0].time);
      timeDiff = Math.floor(timeDiff/(1000*60));
      if(timeDiff>=30&&websiteData[0].status!=='Down')
      transport.sendMail(message, (err, info) => {
        if (err) console.log(`Mail not sent`);
        else console.log(`Mail sent to user`);
      })
      await db.query(`insert into websitestatustracker (url,time) values(?,?)`,[url,new Date()]);
    });
}


export default minitorStatus;