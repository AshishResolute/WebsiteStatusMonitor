import pkg from 'pg'
const {Pool} = pkg;
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:process.env.NODE_ENV==='production'?{
        rejectUnauthorized:false
    }:false
})

pool.query('select 1')
.then(()=>console.log(`DataBase Connected`))
.catch((err)=>console.error(`DataBase error:${err.message}`));

export default {
    query:async(text,params)=>{
        const result = await pool.query(text,params);
        return [result.rows];
    }
}