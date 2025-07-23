import { useEffect,useState } from 'react'; import { useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function VendorHome(){
  const [shop,setShop]=useState(null); const [orders,setOrders]=useState([]); const [wallet,setWallet]=useState(0);
  const nav=useNavigate(); const backend=import.meta.env.VITE_BACKEND_URL; const tok=localStorage.getItem('auth_token');

  useEffect(()=>{load();},[]);
  const load=async()=>{
    const s=await fetch(`${backend}/shop/my`,{headers:{Authorization:tok}}).then(r=>r.json());
    if(s.status==='success') setShop(s.data);
    const o=await fetch(`${backend}/order/vendor`,{headers:{Authorization:tok}}).then(r=>r.json());
    if(o.status==='success') setOrders(o.orders.slice(0,3));
    const w=await fetch(`${backend}/vendor/wallet`,{headers:{Authorization:tok}}).then(r=>r.json());
    if(w.status==='success') setWallet(w.balance);
  };

  if(!shop) return <div className="screen-content"><p>Loading...</p></div>;

  return(
    <div className="screen-content">
      <h2 style={{fontSize:20,fontWeight:600,margin:'0 0 8px'}}>👋 {shop.shop_name}</h2>
      <p style={{color:'var(--text-secondary)',margin:'0 0 24px'}}>{shop.shop_type} • {shop.society}</p>

      {/* Wallet card */}
      <div onClick={()=>nav('/vendor/wallet')} style={{background:'var(--primary-gradient)',borderRadius:12,padding:20,color:'#fff',marginBottom:24,cursor:'pointer'}}>
        <p style={{margin:0,opacity:.9,fontSize:14}}>Wallet Balance</p>
        <h3 style={{margin:'4px 0 0',fontSize:24}}>₹{wallet.toFixed(2)}</h3>
      </div>

      {/* Quick Links */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
        {[
          {icon:'📦',label:'Orders',path:'/vendor/orders'},
          {icon:'🛒',label:'Items',path:'/vendor/items'},
          {icon:'💰',label:'Wallet',path:'/vendor/wallet'},
          {icon:'📈',label:'Analytics',path:'/vendor/analytics'},
          {icon:'👤',label:'Profile',path:'/vendor/profile'},
          {icon:'❓',label:'Support',path:'/vendor/support'},
        ].map(x=>(
          <div key={x.label} onClick={()=>nav(x.path)} style={{background:'var(--background-soft)',border:'1px solid var(--divider)',borderRadius:8,padding:'16px 8px',textAlign:'center',cursor:'pointer'}}>
            <div style={{fontSize:24,marginBottom:8}}>{x.icon}</div><p style={{margin:0,fontSize:12,fontWeight:500}}>{x.label}</p>
          </div>
        ))}
      </div>

      {orders.length>0 && (
        <>
          <h3 style={{fontSize:18,fontWeight:600,margin:'0 0 12px'}}>Recent Orders</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {orders.map(o=>(
              <div key={o.order_id} onClick={()=>nav(`/vendor/order/${o.order_id}`)} style={{border:'1px solid var(--divider)',borderRadius:8,padding:12,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div><p style={{margin:'0 0 4px',fontWeight:600}}>Order #{o.order_id}</p><p style={{margin:0,fontSize:12,color:'var(--text-secondary)'}}>₹{o.final_amount} • {o.status}</p></div>
                <span style={{fontSize:16,color:'var(--text-secondary)'}}>→</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}