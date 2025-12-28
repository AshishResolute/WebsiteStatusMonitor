import express from 'express';
import verifyToken from './verifyToken.js';
import { AppError } from './ErrorClasses.js';
import db from './db.js';
import checkStatus from './axiosMethod.js';
const router = express.Router();

router.post('/add-url',verifyToken,async(req,res,next)=>{
    try{
         let user_id = req.user.id;
         let {url} = req.body;
         if(!url) return next(new AppError(`Enter a valid Url,url cant be empty`));
         await db.query(`insert into userurls (user_id,url) value(?,?)`,[user_id,url]);
         res.status(200).json({Message:`url ${url} added`});
    }
    catch(err)
    {
        next(err)
    }
})


router.get('/geturls',verifyToken,async(req,res,next)=>{
    try{
        let user_id = req.user.id;
        let [urls] = await db.query(`select url from userurls where user_id=?`,[user_id]);
         if(!urls.length) return next(new AppError(`No Urls found add urls first`,404))
        res.status(200).json(urls)
    }
    catch(err)
    {
        next(err)
    }
})


router.delete('/deleteUrl',verifyToken,async(req,res,next)=>{
    try{
        let user_id = req.user.id;
        let {url} = req.body;
      let [deleteUrl] =  await db.query(`delete from userurls where user_id=? and url=?`,[user_id,url]);
      if(deleteUrl.affectedRows===0) return next(new AppError(`url ${url} not Deleted,check again if url Exists`,404));
      res.status(200).json({Message:`Url ${url} deleted`})
    }
    catch(err)
    {
        next(err)
    }
})
export default router;