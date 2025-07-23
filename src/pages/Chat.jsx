import { useEffect,useState } from 'react'; import { useParams } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function Chat(){
  const {id}=useParams(); const [msgs,setMsgs]=useState([]); const [text,setText]=useState('');
  const backend=import.meta.env.VITE_BACKEND_URL; const tok=localStorage.getItem('auth_token');

  const load=()=>fetch(`${backend}/order/vendor/messages/${id}`,{headers:{Authorization:tok}}).then(r=>r.json()).then(d=>setMsgs(d.messages||[]));
  useEffect(()=>{load();},[]);
  const send=async()=>{
    if(!text.trim())return;
    const res=await fetch(`${backend}/order/vendor/message/send/${id}`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':tok},body:JSON.stringify({message:text.trim()})}).then(r=>r.json());
    if(res.status==='success'){setText('');load();} else alert(res.message);
  };

  return(<div className="screen-content">
    <h2 style={{fontSize:20,fontWeight:600,marginBottom:16}}>Chat</h2>
    <div style={{flex:1,overflowY:'auto',marginBottom:56}}>
      {msgs.map(m=>(
        <div key={m.id} style={{marginBottom:8,textAlign:m.sender_phone===tok?'right':'left'}}>
          <span style={{display:'inline-block',padding:'8px 12px',borderRadius:16,background:m.sender_phone===tok?'var(--primary-gradient)':'var(--background-soft)',color:m.sender_phone===tok?'#fff':'inherit'}}>{m.message}</span>
        </div>
      ))}
    </div>
    <div style={{position:'fixed',bottom:0,left:0,right:0,display:'flex',padding:12,background:'#fff',borderTop:'1px solid var(--divider)'}}>
      <input style={{flex:1,border:'1px solid var(--divider)',borderRadius:20,padding:'8px 12px'}} value={text} onChange={e=>setText(e.target.value)}/>
      <button className="btn btn-primary" style={{marginLeft:8}} onClick={send}>Send</button>
    </div>
  </div>);
}