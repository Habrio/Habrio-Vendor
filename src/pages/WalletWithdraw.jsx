// src/pages/WalletWithdraw.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function WalletWithdraw() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  const withdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backend}/vendor/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Withdrawal initiated');
        navigate('/wallet');
      } else {
        alert(data.message || 'Failed');
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-content">
      <h2 className="title mb-lg">Withdraw Funds</h2>
      <input className="form-input" type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" />
      <button className="btn btn-primary btn-full mt-md" onClick={withdraw} disabled={loading}>{loading ? 'Please wait...' : 'Withdraw'}</button>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 16 }}>Withdrawals may take up to 2 business days to reflect in your bank.</p>
    </div>
  );
}