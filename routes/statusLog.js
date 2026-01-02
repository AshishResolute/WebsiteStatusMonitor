import db from './db.js';
import express from 'express';
import { AppError } from './ErrorClasses.js';
import verifyToken from './verifyToken.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
const router = express.Router();


router.get('/logs',verifyToken,async(req,res,next)=>{
    try{
        let user_id=req.user.id;
        let [logs] = await db.query(`select * from websitestatus where user_id=$1 order by time desc limit 10`,[user_id]);
        const [userAddress] = await db.query(`select email from users where id=$1`,[user_id])
        if(!logs.length) return next(new AppError(`No Logs Found`,404))
        const userStatusLogsPdf = await PDFDocument.create();
        const PdfFont = await userStatusLogsPdf.embedFont(StandardFonts.Helvetica);
        const Page = userStatusLogsPdf.addPage()
        const {width,height} = Page.getSize();
        Page.drawText(`Website Status Report`,{x:50,y:height-50,size:20,font:PdfFont,color:rgb(0, 0.29, 0.14)})
        Page.drawText(`Report for: ${userAddress[0].email}`,{x:50,y:height-75,size:10,font:PdfFont,color:rgb(0.3, 0.3, 0.3)})
        let startDataFrom = height-150;
        logs.forEach(data=>{
            const statusColor = data.status === 'Up' ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0)
            Page.drawText(`Url:${data.url}`,{x:50,y:startDataFrom,size:12,font:PdfFont,color:rgb(0.2, 0.2, 0.2)})
            Page.drawText(`Status:${data.status}`,{x:50,y:startDataFrom-15,size:11,font:PdfFont,color:statusColor})
            Page.drawText(`Time:${data.time.toLocaleString()}`,{x:50,y:startDataFrom-30,size:11,font:PdfFont,color:rgb(0.5, 0.5, 0.5)})
            startDataFrom-=50
        })
        const PdfBytes = await userStatusLogsPdf.save()
        res.setHeader(`Content-Type`,'application/pdf');
        res.setHeader('Content-Disposition','attachment; filename=report.pdf')
        res.send(Buffer.from(PdfBytes))
    }
    catch(err)
    {
        next(err)
    }
})


export default router;