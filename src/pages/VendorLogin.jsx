import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorLogin() {
  const [phone,setPhone] = useState('');
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;

  const sendOtp = async ()=>{
    if(!/^[0-9]{10}$/.test(phone)){alert('Enter 10-digit phone');return;}
    const res = await fetch(`${backend}/send-otp`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:'+91'+phone})});
    const data = await res.json();
    if(data.status==='success') navigate('/vendor/otp',{state:{phone}});
    else alert(data.message||'Failed');
  };

  return (
    <div className="mobile-screen fade-in">
      <div className="status-bar"><span className="time">9:41</span><span className="battery">🔋</span></div>
      <div className="screen-content">
        <h2 className="title text-center mb-lg" style={{paddingTop:48}}>Vendor Login</h2>
        <div className="form-group mb-md">
          <div className="phone-input-group"><div className="country-code">+91</div>
            <input type="tel" className="phone-input" placeholder="9876543210" maxLength="10" value={phone} onChange={e=>setPhone(e.target.value)}/>
          </div>
        </div>
        <button className="btn btn-primary btn-full btn-large" onClick={sendOtp}>Send OTP</button>
      </div>
    </div>
  );
}