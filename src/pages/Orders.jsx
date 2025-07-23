import { useEffect,useState } from 'react'; import { useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function Orders(){
  const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true); const nav=useNavigate();
  const backend=import.meta.env.VITE_BACKEND_URL; const tok=localStorage.getItem('auth_token');

  useEffect(()=>{fetch(`${backend}/order/vendor`,{headers:{Authorization:tok}}).then(r=>r.json()).then(d=>{setOrders(d.orders||[]);setLoading(false);});},[]);
  if(loading) return <div className="screen-content"><p>Loading...</p></div>;
  return(<div className="screen-content"><h2 style={{fontSize:20,fontWeight:600,marginBottom:16}}>All Orders</h2>
    {orders.length===0?<p>No orders yet.</p>:orders.map(o=>(
      <div key={o.order_id} onClick={()=>nav(`/vendor/order/${o.order_id}`)} style={{border:'1px solid var(--divider)',borderRadius:8,padding:12,marginBottom:12,cursor:'pointer'}}>
        <p style={{margin:'0 0 4px',fontWeight:600}}>Order #{o.order_id} • {o.status}</p>
        <p style={{margin:0,fontSize:12,color:'var(--text-secondary)'}}>₹{o.final_amount} • {new Date(o.created_at).toLocaleString()}</p>
      </div>
    ))}
  </div>);
}