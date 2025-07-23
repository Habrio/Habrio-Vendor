// src/pages/Orders.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, delivered, cancelled
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch(`${backend}/order/vendor`, {
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setOrders(data.orders || []);
      } else {
        console.error('Failed to load orders:', data.message);
      }
    } catch (error) {
      console.error('Orders loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#FFF3CD', text: '#B8860B', border: '#FFEAA7' };
      case 'accepted': return { bg: '#CCE7FF', text: '#0066CC', border: '#99D6FF' };
      case 'delivered': return { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' };
      default: return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
    }
  };

  const getOrderTotal = (order) => {
    return order.final_amount || order.total_amount || 0;
  };

  if (loading) {
    return (
      <div className="screen-content">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
          📋 All Orders
        </h2>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          <div style={{ 
            background: 'var(--background-soft)', 
            border: '1px solid var(--divider)',
            borderRadius: 8, 
            padding: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Total</div>
          </div>
          <div style={{ 
            background: stats.pending > 0 ? '#FFF3CD' : 'var(--background-soft)', 
            border: `1px solid ${stats.pending > 0 ? '#FFEAA7' : 'var(--divider)'}`,
            borderRadius: 8, 
            padding: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: stats.pending > 0 ? '#B8860B' : 'var(--text-primary)' }}>
              {stats.pending}
            </div>
            <div style={{ fontSize: 10, color: stats.pending > 0 ? '#B8860B' : 'var(--text-secondary)' }}>
              Pending
            </div>
          </div>
          <div style={{ 
            background: 'var(--background-soft)', 
            border: '1px solid var(--divider)',
            borderRadius: 8, 
            padding: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>
              {stats.delivered}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Delivered</div>
          </div>
          <div style={{ 
            background: 'var(--background-soft)', 
            border: '1px solid var(--divider)',
            borderRadius: 8, 
            padding: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#DC2626' }}>
              {stats.cancelled}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'accepted', label: 'Accepted', count: stats.accepted },
            { key: 'delivered', label: 'Delivered', count: stats.delivered },
            { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              style={{
                background: filter === option.key ? 'var(--primary-color)' : 'var(--background-soft)',
                color: filter === option.key ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === option.key ? 'var(--primary-color)' : 'var(--divider)'}`,
                borderRadius: 20,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {option.label}
              {option.count > 0 && (
                <span style={{
                  background: filter === option.key ? 'rgba(255,255,255,0.3)' : 'var(--primary-color)',
                  color: filter === option.key ? 'white' : 'white',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontSize: 10,
                  fontWeight: 700
                }}>
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 32, 
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {orders.length === 0 ? '📦' : '🔍'}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            {orders.length === 0 ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {orders.length === 0 ? 'Orders will appear here when customers place them' : `No orders found with ${filter} status`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredOrders.map(order => {
            const statusStyle = getStatusColor(order.status);
            const total = getOrderTotal(order);
            const itemCount = order.items ? order.items.length : 0;

            return (
              <div
                key={order.order_id}
                onClick={() => navigate(`/order/${order.order_id}`)}
                style={{
                  border: '1px solid var(--divider)',
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  background: 'var(--background)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                        Order #{order.order_id}
                      </h3>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: statusStyle.text,
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          padding: '2px 6px',
                          borderRadius: 8,
                          textTransform: 'uppercase'
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-color)' }}>
                        ₹{total.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {order.payment_mode === 'wallet' ? '💳 Prepaid' : '💰 COD'}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Customer: {order.customer || 'Unknown'} • {new Date(order.created_at).toLocaleString()}
                    </div>

                    {order.delivery_notes && (
                      <div style={{ 
                        fontSize: 12, 
                        color: 'var(--text-secondary)',
                        background: 'var(--background-soft)',
                        padding: '4px 8px',
                        borderRadius: 6,
                        marginTop: 8
                      }}>
                        📝 {order.delivery_notes}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>→</span>

                    {order.status === 'pending' && (
                      <div style={{
                        background: '#FFF3CD',
                        color: '#B8860B',
                        fontSize: 8,
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 10,
                        textTransform: 'uppercase'
                      }}>
                        ACTION NEEDED
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions for Pending Orders */}
                {order.status === 'pending' && (
                  <div style={{ 
                    display: 'flex', 
                    gap: 8, 
                    marginTop: 12, 
                    paddingTop: 12, 
                    borderTop: '1px solid var(--divider)' 
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Quick accept action - you could implement this
                        navigate(`/order/${order.order_id}`);
                      }}
                      style={{
                        flex: 1,
                        background: '#D1FAE5',
                        color: '#059669',
                        border: '1px solid #A7F3D0',
                        borderRadius: 6,
                        padding: '6px',
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/order/${order.order_id}/chat`);
                      }}
                      style={{
                        flex: 1,
                        background: 'var(--background-soft)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--divider)',
                        borderRadius: 6,
                        padding: '6px',
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      💬 Chat
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action for Pending Orders */}
      {stats.pending > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            background: 'var(--primary-gradient)',
            color: 'white',
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(252, 100, 79, 0.3)',
            zIndex: 1000
          }}
          onClick={() => setFilter('pending')}
        >
          {stats.pending}
        </div>
      )}
    </div>
  );
}