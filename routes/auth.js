import express from 'express'
import db from './db.js';
const router = express.Router();
import { AppError } from './ErrorClasses.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config()
router.post('/user/sign-up', async (req, res, next) => {
    try {
        let { name, password, confirmPassword } = req.body;
        if (!name || !password || !confirmPassword) {
            return next(new AppError('Enter complete Details', 400))
        }
        if (password !== confirmPassword) {
            return next(new AppError('Passwords Dont match,Try again', 400))
        }
        let hashedPasword = await bcrypt.hash(password, 10)
        await db.query(`insert into users (name,password) value(?,?)`, [name, hashedPasword])
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
        let [findUser] = await db.query(`select * from users where name=?`, [userName])
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

export default router;