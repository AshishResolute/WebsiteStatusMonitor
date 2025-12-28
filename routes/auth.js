import express from 'express'
import db from './db.js';
const router = express.Router();
import { AppError } from './ErrorClasses.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import verifyToken from './verifyToken.js';
dotenv.config()
router.post('/user/sign-up', async (req, res, next) => {
    try {
        let { name,email, password, confirmPassword } = req.body;
        if (!name || !password || !confirmPassword||!email) {
            return next(new AppError('Enter complete Details', 400))
        }
        if (password !== confirmPassword) {
            return next(new AppError('Passwords Dont match,Try again', 400))
        }
        else if(password.length<8) return next(new AppError(`Password must be at least 8 characters long`,400))
        let hashedPasword = await bcrypt.hash(password, 10)
        await db.query(`insert into users (name,password,email) values($1,$2,$3)`, [name, hashedPasword,email])
        res.status(200).json({ Message: `User ${name} added` })
    }
    catch (err) {
        next(err)
    }
})


router.post('/user/login', async (req, res, next) => {
    try {
        let { userName, password } = req.body;
        if (!userName || !password || password.trim() === '') return next(new AppError('Enter Complete Details', 400))
        let [findUser] = await db.query(`select * from users where name=$1`, [userName])
        if (!findUser.length) return next(new AppError(`User not Found`, 404))
        let hashedPasword = findUser[0].password;
        let MatchPasswords = await bcrypt.compare(password, hashedPasword)
        if (!MatchPasswords) return next(new AppError(`Passwords Dont Match`, 400))
        const token = jwt.sign({ id: findUser[0].id, name: findUser[0].name }, process.env.SECRET_KEY, { expiresIn: "15m" })
        res.status(200).json({ Message: `Welcome Back ${findUser[0].name}`, token })
    }
    catch (err) {
        next(err)
    }
})

router.patch('/user/updatePassword',verifyToken,async(req,res,next)=>{
    try{
        let user_id= req.user.id;
        let {password,newPassword} = req.body;
        let [checkPassword] = await db.query(`select password from users where id=$1`,[user_id])
        let check = await bcrypt.compare(password,checkPassword[0].password)
        if(!check) return next(new AppError(`Passwords Dont Match,Try Again`));
        let hashedPasword = await bcrypt.hash(newPassword,10);
        await db.query(`update  users set password=$1 where id=$2`,[hashedPasword,user_id])
        res.status(200).json({Message:`Password changed Successfully`})
     }
     catch(err)
     {
        next(err)
     }
})


router.patch('/addEmail',verifyToken,async(req,res,next)=>{
    try{
        let user_id=req.user.id;
        let {email,password} = req.body;
        let [findUser] = await db.query(`select password from users where id=$1`,[user_id]);
       let check = await bcrypt.compare(password,findUser[0].password)
       if(!check) return next(new AppError('Passwords Dont Match,Try Again',400))
        await db.query(`update users set email=$1 where id=$2`,[email,user_id])
       res.status(200).json({Message:`Email was added successfully`})
    }
    catch(err)
    {
        next(err)
    }
})
export default router;