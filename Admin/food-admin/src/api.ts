// The session lives in an httpOnly cookie that JavaScript cannot read (so XSS cannot steal it).
// The browser sends it automatically (credentials:'include'); we add a CSRF header to write requests.
import type {Category,Item,Order} from './types';
const BASE=import.meta.env.VITE_API_URL??'http://localhost:4000';
let csrf='';
let onAuthLost:()=>void=()=>{};
export const setAuthLostHandler=(fn:()=>void)=>{onAuthLost=fn};
async function req<T>(path:string,method='GET',body?:unknown):Promise<T>{
 let res:Response;
 try{res=await fetch(BASE+path,{method,credentials:'include',
  headers:{'Content-Type':'application/json',...(method!=='GET'&&csrf?{'X-CSRF-Token':csrf}:{})},body:body===undefined?undefined:JSON.stringify(body)})}
 catch{throw new Error('Cannot reach the server. Check your connection and try again')}
 if(res.status===204)return undefined as T;
 const json=await res.json().catch(()=>({}));
 if(res.status===401&&!path.startsWith('/api/auth/'))onAuthLost(); // session expired or revoked
 if(!res.ok){const d=json?.error?.details as Record<string,string[]>|undefined;
  throw new Error(d&&Object.keys(d).length?Object.values(d).flat().join('. '):json?.error?.message||'Request failed')}
 return json.data as T}
type Session={user:{id:string;name:string;role:string};csrfToken:string};
export const api={
 login:async(email:string,password:string)=>{
  const r=await req<Session>('/api/auth/login','POST',{email,password});csrf=r.csrfToken;
  if(r.user.role!=='ADMIN'){await req('/api/auth/logout','POST');throw new Error('This account does not have admin access')}
  return r.user},
 me:async()=>{const r=await req<Session>('/api/auth/me');csrf=r.csrfToken;return r.user},
 logout:async()=>{try{await req('/api/auth/logout','POST')}finally{csrf=''}},
 categories:()=>req<Category[]>('/api/admin/categories'),
 saveCategory:async(c:Category|{name:string})=>{'id' in c?await req(`/api/admin/categories/${c.id}`,'PUT',{name:c.name}):await req('/api/admin/categories','POST',{name:c.name})},
 deleteCategory:async(id:string)=>{await req(`/api/admin/categories/${id}`,'DELETE')},
 items:()=>req<Item[]>('/api/admin/items'),
 saveItem:async(i:Partial<Item>)=>{const b={name:i.name,description:i.description??'',price:Number(i.price),categoryId:i.categoryId,imageUrl:i.imageUrl??'',stock:Number(i.stock),available:!!i.available};
  i.id?await req(`/api/admin/items/${i.id}`,'PUT',b):await req('/api/admin/items','POST',b)},
 deleteItem:async(id:string)=>{await req(`/api/admin/items/${id}`,'DELETE')},
 orders:()=>req<Order[]>('/api/admin/orders'),
 updateOrder:async(id:string,patch:Partial<Order>)=>{await req(`/api/admin/orders/${id}`,'PATCH',{status:patch.status,paymentStatus:patch.paymentStatus})}};
