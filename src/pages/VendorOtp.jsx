import { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function VendorOtp(){
  const [otp,setOtp]=useState(''); const {state}=useLocation(); const phone=state?.phone; const nav=useNavigate();
  const backend=import.meta.env.VITE_BACKEND_URL;

  const verify=async()=>{
    if(!/^[0-9]{6}$/.test(otp)){alert('Enter 6-digit');return;}
    const res=await fetch(`${backend}/verify-otp`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:'+91'+phone,otp})});
    const data=await res.json();
    if(data.status==='success'){localStorage.setItem('auth_token',data.auth_token);
      data.basic_onboarding_done?nav('/vendor/home'):nav('/vendor/onboarding/basic');
    }else alert(data.message||'Incorrect OTP');
  };

  return(
    <div className="mobile-screen fade-in">
      <div className="status-bar"><span className="time">9:41</span><span className="battery">🔋</span></div>
      <div className="screen-content">
        <h2 className="title text-center mb-lg">OTP for +91 {phone}</h2>
        <input className="otp-input" maxLength="6" placeholder="------" value={otp} onChange={e=>setOtp(e.target.value)} style={{width:'100%',textAlign:'center',fontSize:24,letterSpacing:4,padding:12,border:'1px solid #ccc',borderRadius:8}}/>
        <button className="btn btn-primary btn-full btn-large mt-lg" onClick={verify}>Verify</button>
      </div>
    </div>
  );
}