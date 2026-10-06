import {Router} from 'express';
import {z} from 'zod';
import type {OrderStatus} from '@prisma/client';
import {prisma} from '../db';
import {HttpError,requireAuth,requireRole} from '../auth';
export const admin=Router();
admin.use(requireAuth,requireRole('ADMIN')); // every route below is admin-only
const NEXT:Record<OrderStatus,OrderStatus[]>={PENDING:['CONFIRMED','CANCELLED'],CONFIRMED:['PREPARING','CANCELLED'],PREPARING:['OUT_FOR_DELIVERY','CANCELLED'],OUT_FOR_DELIVERY:['DELIVERED'],DELIVERED:[],CANCELLED:[]};
const catS=z.object({name:z.string().trim().min(1,'Enter a name').max(60)});
const itemS=z.object({name:z.string().trim().min(1,'Enter a name').max(100),description:z.string().max(500).default(''),
 price:z.coerce.number().int().positive('Price must be more than 0'),categoryId:z.string().min(1,'Choose a category'),
 imageUrl:z.union([z.string().url('Enter a valid image URL'),z.literal('')]).default(''),stock:z.coerce.number().int().min(0,'Stock cannot be negative'),available:z.boolean()});
const patchS=z.object({status:z.enum(['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']).optional(),paymentStatus:z.enum(['PENDING','PAID','FAILED']).optional()});
// Categories
admin.get('/categories',async(_q,res)=>{res.json({data:await prisma.category.findMany({orderBy:{name:'asc'}})})});
admin.post('/categories',async(req,res)=>{res.status(201).json({data:await prisma.category.create({data:catS.parse(req.body)})})});
admin.put('/categories/:id',async(req,res)=>{res.json({data:await prisma.category.update({where:{id:req.params.id},data:catS.parse(req.body)})})});
admin.delete('/categories/:id',async(req,res)=>{
 if(await prisma.foodItem.count({where:{categoryId:req.params.id}}))throw new HttpError(409,'Move or delete its food items first');
 await prisma.category.delete({where:{id:req.params.id}});res.status(204).end()});
// Food items
admin.get('/items',async(_q,res)=>{res.json({data:await prisma.foodItem.findMany({orderBy:{createdAt:'desc'}})})});
admin.post('/items',async(req,res)=>{res.status(201).json({data:await prisma.foodItem.create({data:itemS.parse(req.body)})})});
admin.put('/items/:id',async(req,res)=>{res.json({data:await prisma.foodItem.update({where:{id:req.params.id},data:itemS.parse(req.body)})})});
admin.delete('/items/:id',async(req,res)=>{await prisma.foodItem.delete({where:{id:req.params.id}});res.status(204).end()});
// Orders
admin.get('/orders',async(_q,res)=>{
 const o=await prisma.order.findMany({include:{items:true},orderBy:{createdAt:'desc'}});
 res.json({data:o.map(x=>({...x,items:x.items.map(({name,qty,price})=>({name,qty,price}))}))})});
admin.patch('/orders/:id',async(req,res)=>{
 const p=patchS.parse(req.body);const o=await prisma.order.findUniqueOrThrow({where:{id:req.params.id}});
 if(p.status&&p.status!==o.status&&!NEXT[o.status].includes(p.status))throw new HttpError(409,`Cannot move an order from ${o.status} to ${p.status}`);
 res.json({data:await prisma.order.update({where:{id:o.id},data:p})})});
