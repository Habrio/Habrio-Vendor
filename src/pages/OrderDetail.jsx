// src/pages/OrderDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await fetch(`${backend}/order/vendor`, {
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (data.status === 'success') {
        const found = data.orders.find(o => o.order_id == id);
        if (found) {
          setOrder(found);
        } else {
          alert('Order not found');
          navigate('/orders');
        }
      }
    } catch (error) {
      console.error('Load order error:', error);
      alert('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`${backend}/order/vendor/status/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setOrder(prev => ({ ...prev, status }));
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Network error');
    }
  };

  if (loading) {
    return (
      <div className="screen-content">
        <p>Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="screen-content">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="screen-content">
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Order #{order.order_id}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Status: <b>{order.status}</b></p>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Items</h3>
      {order.items.map((it, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>{it.name} x{it.quantity}</span><span>₹{it.subtotal}</span>
        </div>
      ))}
      <p style={{ textAlign: 'right', fontWeight: 600, marginTop: 8 }}>Total: ₹{order.final_amount}</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        {order.status === 'pending' && (
          <button className="btn btn-primary flex-1" onClick={() => updateStatus('accepted')}>Accept</button>
        )}
        {order.status !== 'delivered' && (
          <button className="btn flex-1" onClick={() => updateStatus('delivered')}>Mark Delivered</button>
        )}
      </div>

      <button className="btn-secondary btn-full mt-md" onClick={() => navigate(`/order/${id}/chat`)}>Open Chat 💬</button>
    </div>
  );
}