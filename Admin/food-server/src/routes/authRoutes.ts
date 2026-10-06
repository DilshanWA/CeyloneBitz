import {Router} from 'express';
import {z} from 'zod';
import bcrypt from 'bcryptjs';
import {prisma} from '../db';
import {HttpError,requireAuth,signToken} from '../auth';
export const authRoutes=Router();
const email=z.string().trim().toLowerCase().email('Enter a valid email');
const password=z.string().min(8,'Use at least 8 characters').max(72);
const DUMMY=bcrypt.hashSync('not-a-real-password',12);
const pub=(u:{id:string;name:string;email:string;role:string})=>({id:u.id,name:u.name,email:u.email,role:u.role});
// Public registration always creates a CUSTOMER. The role is never read from the request.
authRoutes.post('/register',async(req,res)=>{
 const b=z.object({name:z.string().trim().min(1).max(80),email,password}).parse(req.body);
 if(await prisma.user.findUnique({where:{email:b.email}}))throw new HttpError(409,'An account with this email already exists');
 const u=await prisma.user.create({data:{name:b.name,email:b.email,passwordHash:await bcrypt.hash(b.password,12)}});
 res.status(201).json({data:{token:signToken(u),user:pub(u)}})});
authRoutes.post('/login',async(req,res)=>{
 const b=z.object({email,password:z.string().min(1)}).parse(req.body);
 const u=await prisma.user.findUnique({where:{email:b.email}});
 const ok=await bcrypt.compare(b.password,u?u.passwordHash:DUMMY); // same work either way, no user enumeration by timing
 if(!u||!ok)throw new HttpError(401,'Wrong email or password');
 res.json({data:{token:signToken(u),user:pub(u)}})});
authRoutes.get('/me',requireAuth,async(req,res)=>{
 res.json({data:pub(await prisma.user.findUniqueOrThrow({where:{id:req.user!.id}}))})});
