import {useEffect,useState} from 'react';
import {api} from '../api';
import type {Category,Item} from '../types';
import {Modal,Field,Empty,inp,btn,btn2,money,toast} from '../ui';
const blank:Partial<Item>={name:'',description:'',price:0,categoryId:'',imageUrl:'',stock:0,available:true};
export default function Items(){
 const [items,setItems]=useState<Item[]>([]);const [cats,setCats]=useState<Category[]>([]);
 const [q,setQ]=useState('');const [cat,setCat]=useState('');
 const [form,setForm]=useState<Partial<Item>|null>(null);const [err,setErr]=useState<Record<string,string>>({});
 const load=()=>{api.items().then(setItems);api.categories().then(setCats)};useEffect(load,[]);
 const shown=items.filter(i=>i.name.toLowerCase().includes(q.toLowerCase())&&(!cat||i.categoryId===cat));
 const set=(k:keyof Item,v:string|number|boolean)=>setForm({...form,[k]:v});
 const save=async()=>{const f=form!;const e:Record<string,string>={};
  if(!f.name?.trim())e.name='Enter a name';if(!(Number(f.price)>0))e.price='Price must be more than 0';
  if(!f.categoryId)e.categoryId='Choose a category';if(!(Number(f.stock)>=0))e.stock='Stock cannot be negative';
  setErr(e);if(Object.keys(e).length)return;
  try{await api.saveItem(f);toast(f.id?'Item saved':'Item created');setForm(null);load()}catch(x){toast((x as Error).message)}};
 const del=async(i:Item)=>{if(!confirm(`Delete ${i.name}?`))return;try{await api.deleteItem(i.id);toast('Item deleted');load()}catch(x){toast((x as Error).message)}};
 const toggle=async(i:Item)=>{await api.saveItem({...i,available:!i.available});load()};
 return <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">Food items</h1>
  <button className={btn} onClick={()=>{setErr({});setForm({...blank,categoryId:cats[0]?.id||''})}}>Add food item</button></div>
  <div className="flex flex-wrap gap-2"><input className={inp+' max-w-xs'} placeholder="Search items" value={q} onChange={e=>setQ(e.target.value)}/>
   <select className={inp+' max-w-xs'} value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
  {shown.length===0?<Empty text="No items match. Add a food item or clear the filters."/>:
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shown.map(i=><article key={i.id} className="overflow-hidden rounded-lg bg-white">
   <div className="h-36 bg-slate-200">{i.imageUrl&&<img src={i.imageUrl} alt={i.name} className="h-full w-full object-cover" loading="lazy"/>}</div>
   <div className="space-y-2 p-3"><div className="flex justify-between gap-2"><h3 className="font-semibold">{i.name}</h3><span className="font-semibold">{money(i.price)}</span></div>
    <p className="text-xs text-slate-500">{cats.find(c=>c.id===i.categoryId)?.name} · <span className={i.stock<=5?'font-semibold text-red-600':''}>{i.stock===0?'Out of stock':`${i.stock} in stock`}</span></p>
    <div className="flex items-center gap-2"><label className="mr-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={i.available} onChange={()=>toggle(i)}/>Available</label>
     <button className={btn2} onClick={()=>{setErr({});setForm(i)}}>Edit</button><button className={btn2+' text-red-600'} onClick={()=>del(i)}>Delete</button></div></div></article>)}</div>}
  {form&&<Modal title={form.id?'Edit food item':'Add food item'} onClose={()=>setForm(null)}><div className="space-y-3">
   <Field label="Name" error={err.name}><input className={inp} value={form.name||''} onChange={e=>set('name',e.target.value)}/></Field>
   <Field label="Description"><textarea className={inp} rows={2} value={form.description||''} onChange={e=>set('description',e.target.value)}/></Field>
   <div className="grid grid-cols-2 gap-3"><Field label="Price (LKR)" error={err.price}><input className={inp} type="number" min="0" value={form.price??0} onChange={e=>set('price',e.target.value)}/></Field>
    <Field label="Stock" error={err.stock}><input className={inp} type="number" min="0" value={form.stock??0} onChange={e=>set('stock',e.target.value)}/></Field></div>
   <Field label="Category" error={err.categoryId}><select className={inp} value={form.categoryId||''} onChange={e=>set('categoryId',e.target.value)}><option value="">Select category</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
   <Field label="Image URL"><input className={inp} placeholder="https://..." value={form.imageUrl||''} onChange={e=>set('imageUrl',e.target.value)}/></Field>
   {form.imageUrl&&<img src={form.imageUrl} alt="Preview" className="h-28 rounded-md object-cover"/>}
   <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.available} onChange={e=>set('available',e.target.checked)}/>Available to order</label>
   <div className="flex justify-end gap-2"><button className={btn2} onClick={()=>setForm(null)}>Cancel</button><button className={btn} onClick={save}>Save item</button></div></div></Modal>}</div>}
