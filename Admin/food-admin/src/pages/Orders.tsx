import {useEffect,useState} from 'react';
import {api} from '../api';
import {NEXT,STATUSES} from '../types';
import type {Order,OrderStatus} from '../types';
import {Badge,Modal,Empty,inp,btn,btn2,money,toast} from '../ui';
export default function Orders(){
 const [orders,setOrders]=useState<Order[]>([]);const [status,setStatus]=useState('');const [pay,setPay]=useState('');
 const [q,setQ]=useState('');const [sel,setSel]=useState<Order|null>(null);
 const load=()=>api.orders().then(setOrders);useEffect(()=>{load()},[]);
 const shown=orders.filter(o=>(!status||o.status===status)&&(!pay||o.paymentMethod===pay)&&(o.orderNumber+o.customerName+o.phone).toLowerCase().includes(q.toLowerCase()));
 const update=async(o:Order,p:Partial<Order>,msg:string)=>{await api.updateOrder(o.id,p);toast(msg);setSel(null);load()};
 return <div className="space-y-4"><h1 className="text-2xl font-bold">Orders</h1>
  <div className="flex flex-wrap gap-2"><input className={inp+' max-w-xs'} placeholder="Search order, name or phone" value={q} onChange={e=>setQ(e.target.value)}/>
   <select className={inp+' max-w-[11rem]'} value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map(s=><option key={s} value={s}>{s.replace(/_/g,' ').toLowerCase()}</option>)}</select>
   <select className={inp+' max-w-[11rem]'} value={pay} onChange={e=>setPay(e.target.value)}><option value="">All payments</option><option value="PAYHERE">PayHere</option><option value="WHATSAPP">WhatsApp</option></select></div>
  {shown.length===0?<Empty text="No orders match these filters."/>:
  <div className="overflow-x-auto rounded-lg bg-white"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b border-slate-200 text-slate-500"><tr>{['Order','Customer','Payment','Status','Total',''].map(h=><th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
   <tbody>{shown.map(o=><tr key={o.id} className="border-b border-slate-100 last:border-0"><td className="p-3 font-medium">{o.orderNumber}<div className="text-xs font-normal text-slate-500">{new Date(o.createdAt).toLocaleString()}</div></td>
    <td className="p-3">{o.customerName}<div className="text-xs text-slate-500">{o.phone}</div></td>
    <td className="p-3">{o.paymentMethod.toLowerCase()} <Badge v={o.paymentStatus}/></td><td className="p-3"><Badge v={o.status}/></td><td className="p-3">{money(o.total)}</td>
    <td className="p-3 text-right"><button className={btn2} onClick={()=>setSel(o)}>View</button></td></tr>)}</tbody></table></div>}
  {sel&&<Modal title={`Order ${sel.orderNumber}`} onClose={()=>setSel(null)}><div className="space-y-3 text-sm">
   <p><b>{sel.customerName}</b> · {sel.phone}<br/>{sel.address}</p>
   <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">{sel.items.map((i,n)=><li key={n} className="flex justify-between p-2"><span>{i.name} × {i.qty}</span><span>{money(i.price*i.qty)}</span></li>)}
    <li className="flex justify-between p-2 font-bold"><span>Total</span><span>{money(sel.total)}</span></li></ul>
   <p>Payment: {sel.paymentMethod.toLowerCase()} <Badge v={sel.paymentStatus}/></p>
   {sel.paymentMethod==='WHATSAPP'&&sel.paymentStatus!=='PAID'&&<button className={btn2} onClick={()=>update(sel,{paymentStatus:'PAID'},'Marked as paid')}>Mark as paid</button>}
   <p>Status: <Badge v={sel.status}/></p>
   {NEXT[sel.status].length===0?<p className="text-slate-500">This order is closed.</p>:
   <div className="flex flex-wrap gap-2">{NEXT[sel.status].map((s:OrderStatus)=><button key={s} className={s==='CANCELLED'?btn2+' text-red-600':btn}
    onClick={()=>(s!=='CANCELLED'||confirm('Cancel this order?'))&&update(sel,{status:s},'Order updated')}>Move to {s.replace(/_/g,' ').toLowerCase()}</button>)}</div>}</div></Modal>}</div>}
