import express from 'express'
import dotenv from 'dotenv';
import auth from './auth.js';
import user from './user.js';
dotenv.config()

let app = express();
const PORT = process.env.SERVER_PORT;
  
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