// src/pages/WalletHistory.jsx
import { useEffect, useState } from 'react';
import '../styles/common.css';
import '../styles/App.css';

export default function WalletHistory() {
  const [txns, setTxns] = useState([]);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');
  useEffect(() => {
    fetch(`${backend}/vendor/wallet/history`, { headers: { Authorization: token } })
      .then(r => r.json())
      .then(d => setTxns(d.transactions || []));
  }, []);
  return (
    <div className="screen-content">
      <h2 className="title mb-lg">Transactions</h2>
      {txns.length === 0 ? <p>No transactions.</p> : txns.map(t => (
        <div key={t.id} style={{ border: '1px solid var(--divider)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>{t.type}</span><span>₹{t.amount}</span></div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(t.created_at).toLocaleString()}</p>
          {t.reference && <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Ref: {t.reference}</p>}
        </div>
      ))}
    </div>
  );
}