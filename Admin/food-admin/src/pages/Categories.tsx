import {useEffect,useState} from 'react';
import {api} from '../api';
import type {Category} from '../types';
import {btn,btn2,inp,toast,Empty} from '../ui';
export default function Categories(){
 const [cats,setCats]=useState<Category[]>([]);const [name,setName]=useState('');const [edit,setEdit]=useState<Category|null>(null);
 const load=()=>api.categories().then(setCats);useEffect(()=>{load()},[]);
 const run=async(fn:()=>Promise<void>,ok:string)=>{try{await fn();toast(ok);load()}catch(e){toast((e as Error).message)}};
 const add=()=>{if(!name.trim())return toast('Enter a category name');run(async()=>{await api.saveCategory({name});setName('')},'Category added')};
 return <div className="max-w-xl space-y-4"><h1 className="text-2xl font-bold">Categories</h1>
  <div className="flex gap-2"><input className={inp} placeholder="New category name" value={name} onChange={e=>setName(e.target.value)}/><button className={btn} onClick={add}>Add category</button></div>
  {cats.length===0?<Empty text="No categories yet. Add one to start building your menu."/>:
  <ul className="divide-y divide-slate-100 rounded-lg bg-white">{cats.map(c=><li key={c.id} className="flex items-center gap-2 p-3">
   {edit?.id===c.id?<><input className={inp} value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})}/>
    <button className={btn} onClick={()=>run(async()=>{await api.saveCategory(edit);setEdit(null)},'Category saved')}>Save</button><button className={btn2} onClick={()=>setEdit(null)}>Cancel</button></>:
   <><span className="flex-1">{c.name}</span><button className={btn2} onClick={()=>setEdit(c)}>Edit</button>
    <button className={btn2+' text-red-600'} onClick={()=>confirm(`Delete ${c.name}?`)&&run(()=>api.deleteCategory(c.id),'Category deleted')}>Delete</button></>}</li>)}</ul>}</div>}
