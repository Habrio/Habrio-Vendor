import { useState } from 'react'; import { useNavigate } from 'react-router-dom';
import '../styles/common.css'; import '../styles/App.css';

export default function AddItem(){
  const nav=useNavigate(); const backend=import.meta.env.VITE_BACKEND_URL; const tok=localStorage.getItem('auth_token');
  const [item,setItem]=useState({title:'',price:'',quantity_in_stock:0,unit:'pcs'});
  const save=async()=>{
    if(!item.title||!item.price)return alert('Title & price');
    const res=await fetch(`${backend}/item/add`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':tok},body:JSON.stringify(item)}).then(r=>r.json());
    if(res.status==='success') nav('/vendor/items'); else alert(res.message);
  };
  return(<div className="screen-content">
    <h2 className="title text-center mb-lg">Add Item</h2>
    {['title','price','quantity_in_stock','unit'].map(f=>(
      <div className="form-group" key={f}><label className="form-label">{f.replace('_',' ').toUpperCase()}</label>
        <input className="form-input" value={item[f]} onChange={e=>setItem({...item,[f]:e.target.value})}/></div>
    ))}
    <button className="btn btn-primary btn-full" onClick={save}>Save</button>
  </div>);
}