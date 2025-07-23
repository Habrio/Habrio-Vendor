import { useEffect,useState } from 'react'; import { useNavigate,useParams } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function EditItem(){
  const {id}=useParams(); const nav=useNavigate(); const backend=import.meta.env.VITE_BACKEND_URL; const tok=localStorage.getItem('auth_token');
  const [item,setItem]=useState(null);

  useEffect(()=>{fetch(`${backend}/item/my`,{headers:{Authorization:tok}}).then(r=>r.json()).then(d=>setItem(d.data.find(i=>i.id==id)));},[]);
  const update=async()=>{
    const res=await fetch(`${backend}/item/update/${id}`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':tok},body:JSON.stringify(item)}).then(r=>r.json());
    if(res.status==='success') nav('/vendor/items'); else alert(res.message);
  };
  if(!item)return <div className="screen-content"><p>Loading...</p></div>;
  return(<div className="screen-content">
    <h2 className="title text-center mb-lg">Edit Item</h2>
    {['title','price','quantity_in_stock','unit'].map(f=>(
      <div className="form-group" key={f}><label className="form-label">{f.replace('_',' ').toUpperCase()}</label>
        <input className="form-input" value={item[f]} onChange={e=>setItem({...item,[f]:e.target.value})}/></div>
    ))}
    <button className="btn btn-primary btn-full" onClick={update}>Update</button>
  </div>);
}