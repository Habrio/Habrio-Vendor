// src/pages/PayoutSetup.jsx
import { useState, useEffect } from 'react';
import '../styles/common.css';
import '../styles/App.css';

export default function PayoutSetup() {
  const [form, setForm] = useState({ bank_name: '', account_number: '', ifsc_code: '' });
  const [loading, setLoading] = useState(false);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  const submit = async () => {
    const { bank_name, account_number, ifsc_code } = form;
    if (!bank_name || !account_number || !ifsc_code) { alert('All fields required'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${backend}/vendor/payout/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.status === 'success') { alert('Payout info saved'); } else { alert(data.message || 'Failed'); }
    } catch (e) { alert('Network error'); } finally { setLoading(false); }
  };

  return (
    <div className="screen-content">
      <h2 className="title mb-lg">Payout Bank Setup</h2>
      {['bank_name','account_number','ifsc_code'].map(f => (
        <div className="form-group" key={f}>
          <label className="form-label">{f.replace('_',' ').toUpperCase()}</label>
          <input className="form-input" value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} disabled={loading} />
        </div>
      ))}
      <button className="btn btn-primary btn-full mt-md" onClick={submit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </div>
  );
}