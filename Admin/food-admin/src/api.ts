// MOCK API (localStorage). To connect your real backend, replace each function body with
// fetch(`${import.meta.env.VITE_API_URL}/api/admin/...`, {headers:{Authorization:`Bearer ${token}`}}).
import type {Category,Item,Order} from './types';
type DB={categories:Category[];items:Item[];orders:Order[]};
const KEY='admin-db';
const img=(q:string)=>`https://source.unsplash.com/400x300/?${q}`;
const seed:DB={
 categories:[{id:'c1',name:'Rice & Kottu'},{id:'c2',name:'Burgers'},{id:'c3',name:'Beverages'}],
 items:[
  {id:'i1',name:'Chicken Kottu',description:'Chopped roti with chicken and veg',price:1600,categoryId:'c1',imageUrl:img('kottu'),stock:20,available:true},
  {id:'i2',name:'Crispy Chicken Burger',description:'Brioche bun, slaw, house sauce',price:1450,categoryId:'c2',imageUrl:img('burger'),stock:4,available:true},
  {id:'i3',name:'Iced Coffee',description:'Cold brew with milk',price:450,categoryId:'c3',imageUrl:img('coffee'),stock:30,available:true},
  {id:'i4',name:'Seafood Fried Rice',description:'Prawns, cuttlefish, egg',price:1900,categoryId:'c1',imageUrl:img('friedrice'),stock:0,available:false}],
 orders:[
  {id:'o1',orderNumber:'ORD-0001',customerName:'Nimal Perera',phone:'0771234567',address:'25 Galle Rd, Colombo 03',paymentMethod:'PAYHERE',paymentStatus:'PAID',status:'PENDING',total:3950,createdAt:new Date().toISOString(),items:[{name:'Chicken Kottu',qty:2,price:1600},{name:'Iced Coffee',qty:1,price:450}]}, 
  {id:'o2',orderNumber:'ORD-0002',customerName:'Kasun Silva',phone:'0712345678',address:'12 Lake Rd, Kandy',paymentMethod:'WHATSAPP',paymentStatus:'PENDING',status:'CONFIRMED',total:1750,createdAt:new Date().toISOString(),items:[{name:'Crispy Chicken Burger',qty:1,price:1450}]},
  {id:'o3',orderNumber:'ORD-0003',customerName:'Amaya Fernando',phone:'0759876543',address:'8 Park St, Galle',paymentMethod:'PAYHERE',paymentStatus:'PAID',status:'DELIVERED',total:2350,createdAt:new Date(Date.now()-864e5*2).toISOString(),items:[{name:'Seafood Fried Rice',qty:1,price:1900},{name:'Iced Coffee',qty:1,price:450}]}]};
const db=():DB=>{const r=localStorage.getItem(KEY);if(r)return JSON.parse(r);localStorage.setItem(KEY,JSON.stringify(seed));return seed};
const put=(d:DB)=>localStorage.setItem(KEY,JSON.stringify(d));
const wait=<T,>(v:T)=>new Promise<T>(r=>setTimeout(()=>r(v),120));
const uid=()=>Math.random().toString(36).slice(2,10);
export const api={
 login:async(email:string,password:string)=>{if(email==='admin@demo.com'&&password==='admin123')return wait('demo-token');throw new Error('Wrong email or password')},
 categories:async()=>wait(db().categories),
 saveCategory:async(c:Category|{name:string})=>{const d=db();const name=c.name.trim();
  if(d.categories.some(x=>x.name.toLowerCase()===name.toLowerCase()&&x.id!==(c as Category).id))throw new Error('Category already exists');
  if('id' in c)d.categories=d.categories.map(x=>x.id===c.id?{...x,name}:x);else d.categories.push({id:uid(),name});put(d);await wait(0)},
 deleteCategory:async(id:string)=>{const d=db();if(d.items.some(i=>i.categoryId===id))throw new Error('Move or delete its food items first');d.categories=d.categories.filter(c=>c.id!==id);put(d);await wait(0)},
 items:async()=>wait(db().items),
 saveItem:async(i:Partial<Item>)=>{const d=db();const v={...i,price:Number(i.price),stock:Number(i.stock)} as Item;
  if(v.id)d.items=d.items.map(x=>x.id===v.id?v:x);else d.items.unshift({...v,id:uid()});put(d);await wait(0)},
 deleteItem:async(id:string)=>{const d=db();d.items=d.items.filter(i=>i.id!==id);put(d);await wait(0)},
 orders:async()=>wait(db().orders.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt))),
 updateOrder:async(id:string,patch:Partial<Order>)=>{const d=db();d.orders=d.orders.map(o=>o.id===id?{...o,...patch}:o);put(d);await wait(0)}};
