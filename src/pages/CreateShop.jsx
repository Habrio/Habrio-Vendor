import { useState } from 'react'; import { useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function CreateShop(){
  const [shop,setShop]=useState({shop_name:'',shop_type:'grocery',description:'',delivers:true,is_open:true});
  const backend=import.meta.env.VITE_BACKEND_URL; const token=localStorage.getItem('auth_token'); const nav=useNavigate();

  const create=async()=>{
    if(!shop.shop_name){alert('Shop name');return;}
    const res=await fetch(`${backend}/vendor/create-shop`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':token},body:JSON.stringify(shop)});
    const d=await res.json(); if(d.status==='success') nav('/vendor/home'); else alert(d.message);
  };

  return(<div className="mobile-screen fade-in">
    <div className="status-bar"><span className="time">9:41</span><span className="battery">🔋</span></div>
    <div className="screen-content"><h2 className="title text-center mb-lg">Create Shop</h2>
      {['shop_name','shop_type','description'].map(f=>(
        <div className="form-group" key={f}><label className="form-label">{f.replace('_',' ').toUpperCase()}</label>
          <input className="form-input" value={shop[f]} onChange={e=>setShop({...shop,[f]:e.target.value})}/></div>
      ))}
      <div className="form-group"><label className="form-label">Delivers?</label>
        <input type="checkbox" checked={shop.delivers} onChange={e=>setShop({...shop,delivers:e.target.checked})}/></div>
      <button className="btn btn-primary btn-full btn-large" onClick={create}>Create</button>
    </div></div>);
}