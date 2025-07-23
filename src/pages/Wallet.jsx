// src/pages/Wallet.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');
  useEffect(() => {
    fetch(`${backend}/vendor/wallet`, { headers: { Authorization: token } })
      .then(r => r.json())
      .then(d => setBalance(d.balance || 0));
  }, []);
  return (
    <div className="screen-content">
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Wallet</h2>
      <div style={{ background: 'var(--primary-gradient)', padding: 24, borderRadius: 12, color: '#fff', marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 28 }}>₹{balance.toFixed(2)}</h3>
        <p style={{ margin: 0, opacity: .9, fontSize: 14 }}>Current balance</p>
      </div>
      <button className="btn btn-primary btn-full mb-md" onClick={() => navigate('/wallet/history')}>Transaction History →</button>
      <button className="btn btn-secondary btn-full" onClick={() => navigate('/wallet/withdraw')}>Withdraw</button>
    </div>
  );
}