import { useEffect,useState } from 'react'; import { useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function Items(){
  const [items,setItems]=useState([]); const nav=useNavigate();
  const backend=import.meta.env.VITE_BACKEND_URL; const tok=localStorage.getItem('auth_token');
  useEffect(()=>{fetch(`${backend}/item/my`,{headers:{Authorization:tok}}).then(r=>r.json()).then(d=>setItems(d.data||[]));},[]);
  return(<div className="screen-content">
    <h2 style={{fontSize:20,fontWeight:600,marginBottom:16}}>My Items</h2>
    <button className="btn btn-primary btn-full mb-md" onClick={()=>nav('/vendor/items/add')}>Add Item +</button>
    {items.length===0?<p>No items.</p>:items.map(it=>(
      <div key={it.id} onClick={()=>nav(`/vendor/items/${it.id}/edit`)} style={{border:'1px solid var(--divider)',borderRadius:8,padding:12,marginBottom:12,cursor:'pointer',display:'flex',justifyContent:'space-between'}}>
        <div><p style={{margin:'0 0 4px',fontWeight:600}}>{it.title}</p><p style={{margin:0,fontSize:12,color:'var(--text-secondary)'}}>₹{it.price} • Stock {it.quantity_in_stock}</p></div>
        <span style={{fontSize:16,color:'var(--text-secondary)'}}>→</span>
      </div>
    ))}
  </div>);
}