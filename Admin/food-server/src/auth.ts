import jwt from 'jsonwebtoken';
import type {SignOptions} from 'jsonwebtoken';
import type {RequestHandler} from 'express';
import type {Role} from '@prisma/client';
import {env} from './env';
import {prisma} from './db';
export class HttpError extends Error{constructor(public status:number,message:string){super(message)}}
declare global{namespace Express{interface Request{user?:{id:string;role:Role}}}}
export const signToken=(u:{id:string;role:Role})=>jwt.sign({role:u.role},env.JWT_SECRET,{subject:u.id,expiresIn:env.JWT_EXPIRES_IN as SignOptions['expiresIn']});
// Authentication: who are you? Role is re-read from the DB so demoted/deleted users lose access immediately.
export const requireAuth:RequestHandler=async(req,_res,next)=>{
 const h=req.headers.authorization;if(!h?.startsWith('Bearer '))throw new HttpError(401,'Sign in to continue');
 let id:string;try{id=jwt.verify(h.slice(7),env.JWT_SECRET).sub as string}catch{throw new HttpError(401,'Your session expired. Sign in again')}
 const u=await prisma.user.findUnique({where:{id},select:{id:true,role:true}});
 if(!u)throw new HttpError(401,'Account not found');
 req.user=u;next()};
// Authorization: are you allowed?
export const requireRole=(...roles:Role[]):RequestHandler=>(req,_res,next)=>{
 if(!req.user||!roles.includes(req.user.role))throw new HttpError(403,'You do not have access to this');next()};
