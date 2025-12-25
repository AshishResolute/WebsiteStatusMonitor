import express from 'express'
import cron from 'node-cron'
import checkStatus from './axiosMethod.js'
import dotenv from 'dotenv';
import auth from './auth.js';
import user from './user.js';
dotenv.config()
// let url = ['https://gemini.google.com/app?hl=en-IN','https://www.youtube.com/','https://music.youtube.com/','www.listia.com'];

let app = express();
const PORT = process.env.SERVER_PORT;
// let task = cron.schedule('*/30 * * * *',()=>{
//   for(let check of url)
//   {
//      checkStatus(check)
//   }
// },{
//   schedule:true,
//   timezone:"Asia/Kolkata"
// })
  
app.use(express.json())
app.use('/auth',auth);
app.use('/user',user)

app.use((err,req,res,next)=>{
 const ErrorDetails = {
   Message:err.message||"Something went wrong",
   timeStamp:new Date().toISOString()
 }
  let status = err.statusCode||500
  res.status(status).json(ErrorDetails)

})
app.listen(PORT,()=>{
  console.log(`Server running at Port ${PORT}`)
})