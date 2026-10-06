import {useEffect,useState} from 'react';
import type {ReactNode} from 'react';
export const inp='w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500';
export const btn='rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50';
export const btn2='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100';
export const money=(n:number)=>'LKR '+n.toLocaleString();
let push:(m:string)=>void=()=>{};
export const toast=(m:string)=>push(m);
export function Toaster(){const [m,setM]=useState('');
 useEffect(()=>{push=x=>{setM(x);setTimeout(()=>setM(''),2500)}},[]);
 return m?<div role="status" className="fixed bottom-4 right-4 z-50 rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{m}</div>:null}
export function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
 return <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={onClose}>
  <div role="dialog" aria-label={title} className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-5" onClick={e=>e.stopPropagation()}>
   <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Close" className="text-slate-500">✕</button></div>{children}</div></div>}
export function Field({label,error,children}:{label:string;error?:string;children:ReactNode}){
 return <label className="block text-sm font-medium text-slate-700">{label}<div className="mt-1 font-normal">{children}</div>{error&&<p className="mt-1 text-xs text-red-600">{error}</p>}</label>}
const colors:Record<string,string>={PENDING:'bg-amber-100 text-amber-800',CONFIRMED:'bg-sky-100 text-sky-800',PREPARING:'bg-violet-100 text-violet-800',OUT_FOR_DELIVERY:'bg-indigo-100 text-indigo-800',DELIVERED:'bg-emerald-100 text-emerald-800',CANCELLED:'bg-red-100 text-red-800',PAID:'bg-emerald-100 text-emerald-800',FAILED:'bg-red-100 text-red-800'};
export const Badge=({v}:{v:string})=><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[v]||''}`}>{v.replace(/_/g,' ').toLowerCase()}</span>;
export const Empty=({text}:{text:string})=><p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">{text}</p>;
