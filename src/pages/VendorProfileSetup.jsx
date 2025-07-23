import { useState } from 'react'; import { useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function VendorProfileSetup(){
  const nav=useNavigate(); const backend=import.meta.env.VITE_BACKEND_URL; const token=localStorage.getItem('auth_token');
  const [profile,setProfile]=useState({business_name:'',business_type:'',gst_number:'',address:''});

  const submit=async()=>{
    const {business_name,business_type,address}=profile;
    if(!business_name||!business_type||!address){alert('Fill mandatory');return;}
    const res=await fetch(`${backend}/vendor/profile`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':token},body:JSON.stringify(profile)});
    const d=await res.json(); if(d.status==='success') nav('/vendor/create-shop'); else alert(d.message);
  };

  return(
    <div className="mobile-screen fade-in">
      <div className="status-bar"><span className="time">9:41</span><span className="battery">🔋</span></div>
      <div className="screen-content">
        <h2 className="title text-center mb-lg">Business Profile</h2>
        {['business_name','business_type','gst_number','address'].map(f=>(
          <div className="form-group" key={f}>
            <label className="form-label">{f.replace('_',' ').toUpperCase()}</label>
            <input className="form-input" value={profile[f]} onChange={e=>setProfile({...profile,[f]:e.target.value})}/>
          </div>
        ))}
        <button className="btn btn-primary btn-full btn-large" onClick={submit}>Save & Continue</button>
      </div>
    </div>
  );
}