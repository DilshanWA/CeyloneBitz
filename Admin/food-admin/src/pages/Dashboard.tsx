import {useEffect,useState} from 'react';
import {api} from '../api';
import {STATUSES} from '../types';
import type {Item,Order} from '../types';
import {Badge,money} from '../ui';
export default function Dashboard(){
 const [orders,setOrders]=useState<Order[]>([]);
 const [items,setItems]=useState<Item[]>([]);
 useEffect(()=>{
  api.orders().then(setOrders);
  api.items().then(setItems)},
[]);
 const today=new Date().toDateString();
 const low=items.filter(i=>i.stock<=5);
 const stats:[string,string|number][]=[
  ['Orders today',orders.filter(o=>new Date(o.createdAt).toDateString()===today).length],
  ['Paid revenue',money(orders.filter(o=>o.paymentStatus==='PAID').reduce((s,o)=>s+o.total,0))],
  ['Pending orders',orders.filter(o=>o.status==='PENDING').length],['Low or out of stock',low.length]
];

 const counts=STATUSES.map(s=>[s,orders.filter(o=>o.status===s).length] as const);const max=Math.max(1,...counts.map(c=>c[1]));
 return <div className="space-y-6"><h1 className="text-2xl font-bold">Dashboard</h1>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([l,v])=><div key={l} className="rounded-lg bg-white p-4"><p className="text-sm text-slate-500">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>)}</div>
  <div className="grid gap-4 lg:grid-cols-2">
   <section className="rounded-lg bg-white p-4"><h2 className="mb-3 font-semibold">Orders by status</h2>
    {counts.map(([s,n])=><div key={s} className="mb-2 flex items-center gap-2 text-sm"><span className="w-32 shrink-0 capitalize">{s.replace(/_/g,' ').toLowerCase()}</span>
     <div className="h-3 flex-1 rounded bg-slate-100"><div className="h-3 rounded bg-amber-500" style={{width:`${n/max*100}%`}}/></div><span className="w-5 text-right">{n}</span></div>)}</section>
   <section className="rounded-lg bg-white p-4"><h2 className="mb-3 font-semibold">Recent orders</h2>
    {orders.slice(0,5).map(o=><div key={o.id} className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0"><span>{o.orderNumber} · {o.customerName}</span><Badge v={o.status}/></div>)}</section></div>
  {low.length>0&&<section className="rounded-lg border border-amber-300 bg-amber-50 p-4"><h2 className="mb-2 font-semibold">Restock soon</h2>
   <ul className="text-sm">{low.map(i=><li key={i.id}>{i.name}: {i.stock} left</li>)}</ul></section>}</div>}
