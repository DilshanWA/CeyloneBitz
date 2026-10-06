import {useEffect,useState} from 'react';
import type {FormEvent} from 'react';
import {api,setAuthLostHandler} from './api';
import {Toaster,inp,btn} from './ui';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Items from './pages/Items';
import Categories from './pages/Categories';
const nav=[['dashboard','Dashboard'],['orders','Orders'],['items','Food items'],['categories','Categories']] as const;
type Page=typeof nav[number][0];
const views={dashboard:Dashboard,orders:Orders,items:Items,categories:Categories};
function Login({onLogin}:{onLogin:()=>void}){
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');
 const [err,setErr]=useState('');const [busy,setBusy]=useState(false);
 const submit=async(e:FormEvent)=>{e.preventDefault();setBusy(true);setErr('');
  try{await api.login(email,password);onLogin()}catch(x){setErr((x as Error).message)}finally{setBusy(false)}};
 return <div className="grid min-h-screen place-items-center bg-slate-900 p-4">
  <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6">
   <h1 className="text-2xl font-bold">Kitchen admin</h1><p className="text-sm text-slate-500">Sign in to manage your menu and orders.</p>
   <label className="block text-sm font-medium">Email<input className={inp} type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
   <label className="block text-sm font-medium">Password<input className={inp} type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
   {err&&<p className="text-sm text-red-600">{err}</p>}
   <button className={btn+' w-full'} disabled={busy}>{busy?'Signing in...':'Sign in'}</button>
  </form></div>}
export default function App(){
 const [authed,setAuthed]=useState<boolean|null>(null);
 useEffect(()=>{setAuthLostHandler(()=>setAuthed(false));api.me().then(u=>setAuthed(u.role==='ADMIN')).catch(()=>setAuthed(false))},[]);
 const [page,setPage]=useState<Page>('dashboard');const [open,setOpen]=useState(false);
 if(authed===null)return <div className="grid min-h-screen place-items-center text-slate-500">Loading...</div>;
 if(!authed)return <><Login onLogin={()=>setAuthed(true)}/><Toaster/></>;
 const View=views[page];
 return <div className="min-h-screen bg-slate-100 md:flex">
  <header className="flex items-center justify-between bg-slate-900 p-3 text-white md:hidden">
   <b>Kitchen admin</b><button onClick={()=>setOpen(!open)} aria-label="Menu" className="px-2 text-xl">☰</button></header>
  <aside className={`${open?'block':'hidden'} w-full shrink-0 bg-slate-900 p-4 text-slate-200 md:block md:min-h-screen md:w-56`}>
   <p className="mb-6 hidden text-lg font-bold text-white md:block">Kitchen admin</p>
   <nav className="space-y-1">{nav.map(([k,l])=><button key={k} onClick={()=>{setPage(k);setOpen(false)}}
    className={`block w-full rounded-md px-3 py-2 text-left text-sm ${page===k?'bg-amber-600 font-semibold text-white':'hover:bg-slate-800'}`}>{l}</button>)}</nav>
   <button className="mt-6 w-full rounded-md px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800" onClick={()=>api.logout().finally(()=>setAuthed(false))}>Sign out</button>
  </aside>
  <main className="min-w-0 flex-1 p-4 md:p-8"><View/></main><Toaster/></div>}
