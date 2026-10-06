import 'dotenv/config';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma=new PrismaClient();
async function main(){
 const email=process.env.SEED_ADMIN_EMAIL?.toLowerCase(),pw=process.env.SEED_ADMIN_PASSWORD;
 if(!email||!pw||pw.length<8)throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (8+ chars) in .env');
 await prisma.user.upsert({where:{email},update:{},create:{name:'Restaurant Admin',email,passwordHash:await bcrypt.hash(pw,12),role:'ADMIN'}});
 // Demo customer for testing that customers are blocked from admin routes (dev only)
 await prisma.user.upsert({where:{email:'customer@demo.com'},update:{},create:{name:'Demo Customer',email:'customer@demo.com',passwordHash:await bcrypt.hash('Customer123!',12),role:'CUSTOMER'}});
 const cat:Record<string,string>={};
 for(const name of ['Rice & Kottu','Burgers','Beverages','Desserts'])cat[name]=(await prisma.category.upsert({where:{name},update:{},create:{name}})).id;
 if(await prisma.foodItem.count()===0){
  const u=(q:string)=>`https://source.unsplash.com/400x300/?${q}`;
  await prisma.foodItem.createMany({data:[
   {name:'Chicken Kottu',description:'Chopped roti with chicken and vegetables',price:1600,categoryId:cat['Rice & Kottu'],imageUrl:u('kottu'),stock:20},
   {name:'Seafood Fried Rice',description:'Prawns, cuttlefish and egg',price:1900,categoryId:cat['Rice & Kottu'],imageUrl:u('friedrice'),stock:0,available:false},
   {name:'Crispy Chicken Burger',description:'Brioche bun, slaw, house sauce',price:1450,categoryId:cat['Burgers'],imageUrl:u('burger'),stock:4},
   {name:'Beef Burger',description:'Double patty with cheddar',price:1750,categoryId:cat['Burgers'],imageUrl:u('beefburger'),stock:15},
   {name:'Iced Coffee',description:'Cold brew with milk',price:450,categoryId:cat['Beverages'],imageUrl:u('icedcoffee'),stock:30},
   {name:'Fresh Lime Juice',description:'Squeezed to order',price:350,categoryId:cat['Beverages'],imageUrl:u('limejuice'),stock:40},
   {name:'Chocolate Brownie',description:'Warm, with vanilla ice cream',price:700,categoryId:cat['Desserts'],imageUrl:u('brownie'),stock:12}]});}
 if(await prisma.order.count()===0){
  await prisma.order.create({data:{orderNumber:'ORD-0001',customerName:'Nimal Perera',phone:'0771234567',address:'25 Galle Rd, Colombo 03',paymentMethod:'PAYHERE',paymentStatus:'PAID',status:'PENDING',total:3950,items:{create:[{name:'Chicken Kottu',qty:2,price:1600},{name:'Iced Coffee',qty:1,price:450}]}}});
  await prisma.order.create({data:{orderNumber:'ORD-0002',customerName:'Kasun Silva',phone:'0712345678',address:'12 Lake Rd, Kandy',paymentMethod:'WHATSAPP',status:'CONFIRMED',total:1750,items:{create:[{name:'Crispy Chicken Burger',qty:1,price:1450}]}}});}
 console.log('Seed complete');}
main().finally(()=>prisma.$disconnect());
