import { useState } from 'react'; import { useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function VendorBasicOnboarding(){
  const [form,setForm]=useState({name:'',city:'',society:''}); const nav=useNavigate();
  const backend=import.meta.env.VITE_BACKEND_URL; const token=localStorage.getItem('auth_token');

  const submit=async()=>{
    const {name,city,society}=form;
    if(!name||!city||!society)return alert('Fill all');
    const res=await fetch(`${backend}/onboarding/basic`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':token},body:JSON.stringify({...form,role:'vendor'})});
    const d=await res.json(); if(d.status==='success') nav('/vendor/onboarding/profile'); else alert(d.message);
  };

  return(
    <div className="mobile-screen fade-in">
      <div className="status-bar"><span className="time">9:41</span><span className="battery">🔋</span></div>
      <div className="screen-content">
        <h2 className="title text-center mb-lg">Your Details</h2>
        {['name','city','society'].map(f=>(
          <div className="form-group" key={f}>
            <label className="form-label">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
            <input className="form-input" value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>
          </div>
        ))}
        <button className="btn btn-primary btn-full btn-large" onClick={submit}>Continue</button>
      </div>
    </div>
  );
}