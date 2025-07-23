import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorTitleScreen() {
  const navigate = useNavigate();
  return (
    <div className="mobile-screen fade-in">
      <div className="status-bar"><span className="time">9:41</span><span className="battery">🔋</span></div>
      <div className="screen-content text-center">
        <div className="logo-box" style={{background:'var(--primary-gradient)',width:84,height:84,borderRadius:24,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 6px 14px rgba(255,125,30,.3)'}} >
          <span style={{fontSize:36,color:'#fff'}}>🏪</span>
        </div>
        <h1 className="title mb-xs" style={{fontSize:24}}>Welcome Vendor</h1>
        <p className="subtitle mb-lg" style={{fontSize:14}}>Manage your shop with Habrio</p>
        <button className="btn btn-primary btn-full btn-large" onClick={()=>navigate('/vendor/login')}>Get Started</button>
        <p style={{fontSize:12,color:'var(--text-tertiary)'}}>Built with ❤️ for local sellers</p>
      </div>
    </div>
  );
}