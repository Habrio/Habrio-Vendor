// src/pages/VendorHome.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorHome() {
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    todayEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load shop details
      const shopRes = await fetch(`${backend}/shop/my`, {
        headers: { Authorization: token }
      });
      const shopData = await shopRes.json();
      if (shopData.status === 'success') {
        setShop(shopData.data);
      }

      // Load recent orders
      const ordersRes = await fetch(`${backend}/order/vendor`, {
        headers: { Authorization: token }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.status === 'success') {
        const allOrders = ordersData.orders || [];
        setOrders(allOrders.slice(0, 5)); // Show only recent 5 orders

        // Calculate stats
        const pending = allOrders.filter(o => o.status === 'pending').length;
        const today = new Date().toDateString();
        const todayOrders = allOrders.filter(o => 
          new Date(o.created_at).toDateString() === today
        );
        const todayEarnings = todayOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);

        setStats({
          totalOrders: allOrders.length,
          pendingOrders: pending,
          todayEarnings
        });
      }

      // Load wallet balance
      const walletRes = await fetch(`${backend}/vendor/wallet`, {
        headers: { Authorization: token }
      });
      const walletData = await walletRes.json();
      if (walletData.status === 'success') {
        setWallet(walletData.balance);
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleShopStatus = async () => {
    try {
      const res = await fetch(`${backend}/vendor/shop/toggle_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ is_open: !shop.is_open })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setShop(prev => ({ ...prev, is_open: !prev.is_open }));
      } else {
        alert(data.message || 'Failed to update shop status');
      }
    } catch (error) {
      console.error('Shop status toggle error:', error);
      alert('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="screen-content">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="screen-content">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Shop not found. Please complete setup.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create-shop')}
          >
            Create Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            👋 {shop.shop_name}
          </h2>
          <button
            onClick={toggleShopStatus}
            style={{
              background: shop.is_open ? 'var(--accent-color)' : '#gray',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {shop.is_open ? '🟢 OPEN' : '🔴 CLOSED'}
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>
          {shop.shop_type} • Welcome back!
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ 
          background: 'var(--primary-gradient)', 
          borderRadius: 12, 
          padding: 16, 
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>₹{wallet.toFixed(0)}</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>Wallet</div>
        </div>
        <div style={{ 
          background: 'var(--background-soft)', 
          border: '1px solid var(--divider)',
          borderRadius: 12, 
          padding: 16,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total Orders</div>
        </div>
        <div style={{ 
          background: stats.pendingOrders > 0 ? '#FFF3CD' : 'var(--background-soft)', 
          border: `1px solid ${stats.pendingOrders > 0 ? '#FFEAA7' : 'var(--divider)'}`,
          borderRadius: 12, 
          padding: 16,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: stats.pendingOrders > 0 ? '#B8860B' : 'var(--text-primary)' }}>
            {stats.pendingOrders}
          </div>
          <div style={{ fontSize: 11, color: stats.pendingOrders > 0 ? '#B8860B' : 'var(--text-secondary)' }}>
            Pending
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: '📦', label: 'Orders', path: '/orders', color: '#4F46E5' },
            { icon: '🛒', label: 'Items', path: '/items', color: '#059669' },
            { icon: '💰', label: 'Wallet', path: '/wallet', color: '#DC2626' },
            { icon: '➕', label: 'Add Item', path: '/items/add', color: '#7C3AED' },
            { icon: '📊', label: 'Analytics', path: '/analytics', color: '#EA580C' },
            { icon: '⚙️', label: 'Profile', path: '/profile', color: '#6B7280' }
          ].map(action => (
            <div
              key={action.label}
              onClick={() => navigate(action.path)}
              style={{
                background: 'var(--background-soft)',
                border: '1px solid var(--divider)',
                borderRadius: 12,
                padding: '16px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{action.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                {action.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
              Recent Orders
            </h3>
            <button
              onClick={() => navigate('/orders')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => (
              <div
                key={order.order_id}
                onClick={() => navigate(`/order/${order.order_id}`)}
                style={{
                  border: '1px solid var(--divider)',
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--background)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      Order #{order.order_id}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: order.status === 'pending' ? '#B8860B' : 
                               order.status === 'delivered' ? '#059669' : '#6B7280',
                        background: order.status === 'pending' ? '#FFF3CD' : 
                                   order.status === 'delivered' ? '#D1FAE5' : '#F3F4F6',
                        padding: '2px 6px',
                        borderRadius: 8,
                        textTransform: 'uppercase'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    ₹{order.final_amount} • {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
                <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 && (
        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 32, 
          textAlign: 'center',
          marginTop: 24
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            No orders yet
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Start by adding items to your shop
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/items/add')}
            style={{ fontSize: 14, padding: '8px 16px' }}
          >
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
}