import express from 'express';
import type {ErrorRequestHandler} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {ZodError} from 'zod';
import {env} from './env';
import {HttpError} from './auth';
import {authRoutes} from './routes/authRoutes';
import {admin} from './routes/admin';
const app=express();
app.use(helmet());
app.use(cors({origin:env.CLIENT_ORIGIN}));
app.use(express.json({limit:'100kb'}));
app.get('/health',(_q,res)=>{res.json({ok:true})});
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:true,legacyHeaders:false,message:{error:{message:'Too many attempts. Try again in 15 minutes'}}}),authRoutes);
app.use('/api/admin',admin);
app.use((_q,res)=>{res.status(404).json({error:{message:'Not found'}})});
const onError:ErrorRequestHandler=(e,_q,res,_n)=>{
 if(e instanceof ZodError){res.status(400).json({error:{message:'Check the form and try again',details:e.flatten().fieldErrors}});return}
 if(e instanceof HttpError){res.status(e.status).json({error:{message:e.message}});return}
 if(e?.code==='P2002'){res.status(409).json({error:{message:'That value already exists'}});return}
 if(e?.code==='P2003'){res.status(400).json({error:{message:'A related record does not exist'}});return}
 if(e?.code==='P2025'){res.status(404).json({error:{message:'Record not found'}});return}
 console.error(e);res.status(500).json({error:{message:'Something went wrong'}})};
app.use(onError);
app.listen(env.PORT,()=>console.log(`API running on http://localhost:${env.PORT}`));
