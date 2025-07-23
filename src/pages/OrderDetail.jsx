import { useEffect,useState } from 'react'; import { useNavigate, useParams } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function OrderDetail(){
  const {id}=useParams(); const [order,setOrder]=useState(null); const nav=useNavigate();
  const backend=import.meta.env.VITE_BACKEND_URL; const tok=localStorage.getItem('auth_token');

  const fetchData=()=>fetch(`${backend}/order/vendor/messages/${id}`,{headers:{Authorization:tok}}).then(r=>r.json());
  useEffect(()=>{fetch(`${backend}/order/vendor`,{headers:{Authorization:tok}}).then(r=>r.json()).then(d=>setOrder(d.orders.find(o=>o.order_id==id)));},[]);
  const updateStatus=async status=>{
    const res=await fetch(`${backend}/order/vendor/status/${id}`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':tok},body:JSON.stringify({status})}).then(r=>r.json());
    if(res.status==='success') setOrder({...order,status}); else alert(res.message);
  };

  if(!order) return <div className="screen-content"><p>Loading...</p></div>;
  return(<div className="screen-content">
    <h2 style={{fontSize:20,fontWeight:600,marginBottom:16}}>Order #{order.order_id}</h2>
    <p style={{margin:'0 0 12px'}}>Status: <b>{order.status}</b></p>
    <h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>Items</h3>
    {order.items.map((it,i)=>(
      <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span>{it.name} x{it.quantity}</span><span>₹{it.subtotal}</span>
      </div>
    ))}
    <p style={{textAlign:'right',fontWeight:600,marginTop:8}}>Total: ₹{order.final_amount}</p>
    <div style={{display:'flex',gap:12,marginTop:24}}>
      {order.status==='pending'&&<button className="btn btn-primary flex-1" onClick={()=>updateStatus('accepted')}>Accept</button>}
      {order.status!=='delivered'&&<button className="btn flex-1" onClick={()=>updateStatus('delivered')}>Mark Delivered</button>}
    </div>
    <button className="btn-secondary btn-full mt-md" onClick={()=>nav(`/vendor/order/${id}/chat`)}>Open Chat 💬</button>
  </div>);
}