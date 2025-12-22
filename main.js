import cron from 'node-cron'
import checkStatus from './axiosMethod.js'
let url = ['https://gemini.google.com/app?hl=en-IN','https://www.youtube.com/','https://music.youtube.com/','www.listia.com'];


let task = cron.schedule('*/59 * * * *',()=>{
  for(let check of url)
  {
     checkStatus(check)
  }
},{
  schedule:true,
  timezone:"Asia/Kolkata"
})
  
