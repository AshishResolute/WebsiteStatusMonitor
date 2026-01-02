import express from 'express'
import dotenv from 'dotenv';
import auth from './auth.js';
import user from './user.js';
import statsLogs from './statusLog.js'
import './nodeCron.js';
dotenv.config()

let app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get('/health', (req, res, next) => {
  res.status(200).json({
    status: 'Ok',
    timeStamp: new Date().toISOString()
  });
});


app.use('/auth', auth);
app.use('/user', user)
app.use('statsLogs', statsLogs)


app.use((err, req, res, next) => {
  const ErrorDetails = {
    Message: err.message || "Something went wrong",
    timeStamp: new Date().toISOString()
  }
  let status = err.statusCode || 500
  res.status(status).json(ErrorDetails)

})
app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`)
})