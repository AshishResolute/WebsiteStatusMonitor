import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {AppError} from './ErrorClasses.js'
dotenv.config();
let verifyToken = (req,res,next)=>{
    let auth = req.get('Authorization')
    if(!auth) return next(new AppError(`token not received`,400))
        let token = auth.split(' ')[1];
    jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
        if(err) return next(new AppError(`Token not verified`,400))
            req.user = decode;
        next()
    })
}
export default verifyToken;