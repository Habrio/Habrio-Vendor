// src/pages/CreateShop.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function CreateShop() {
  const [shop, setShop] = useState({
    shop_name: '',
    shop_type: 'grocery',
    description: '',
    delivers: true,
    is_open: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  const shopTypes = [
    'grocery',
    'pharmacy',
    'electronics',
    'clothing',
    'restaurant',
    'bakery',
    'stationery',
    'hardware',
    'beauty',
    'books',
    'other'
  ];

  const handleInputChange = (field, value) => {
    setShop(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const create = async () => {
    if (!shop.shop_name.trim()) {
      alert('Shop name is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backend}/vendor/create-shop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(shop),
      });

      const data = await res.json();

      if (data.status === 'success') {
        navigate('/home');
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Shop creation error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-screen fade-in">
      <div className="status-bar">
        <span className="time">9:41</span>
        <span className="battery">🔋</span>
      </div>

      <div className="screen-content">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div 
            style={{
              background: 'var(--primary-gradient)',
              width: 64,
              height: 64,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 6px 16px rgba(252, 100, 79, 0.25)'
            }}
          >
            <span style={{ fontSize: 28, color: '#fff' }}>🏪</span>
          </div>

          <h2 className="title text-center mb-lg" style={{ fontSize: 24, fontWeight: 600 }}>
            Create Your Shop
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Set up your shop to start selling
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Shop Name *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your shop name"
            value={shop.shop_name}
            onChange={(e) => handleInputChange('shop_name', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Shop Type *</label>
          <select
            className="form-input"
            value={shop.shop_type}
            onChange={(e) => handleInputChange('shop_type', e.target.value)}
            disabled={loading}
            style={{ 
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '40px'
            }}
          >
            {shopTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Describe what you sell..."
            value={shop.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={loading}
            style={{ 
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        </div>

        <div className="form-group">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '12px 0'
          }}>
            <input
              type="checkbox"
              id="delivers"
              checked={shop.delivers}
              onChange={(e) => handleInputChange('delivers', e.target.checked)}
              disabled={loading}
              style={{ 
                width: 20, 
                height: 20,
                accentColor: 'var(--primary-color)'
              }}
            />
            <label htmlFor="delivers" className="form-label" style={{ margin: 0 }}>
              🚚 Offer home delivery
            </label>
          </div>
        </div>

        <div className="form-group">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '12px 0'
          }}>
            <input
              type="checkbox"
              id="is_open"
              checked={shop.is_open}
              onChange={(e) => handleInputChange('is_open', e.target.checked)}
              disabled={loading}
              style={{ 
                width: 20, 
                height: 20,
                accentColor: 'var(--primary-color)'
              }}
            />
            <label htmlFor="is_open" className="form-label" style={{ margin: 0 }}>
              🕒 Shop is currently open
            </label>
          </div>
        </div>

        <button 
          className={`btn btn-primary btn-full btn-large ${loading ? 'opacity-50' : ''}`}
          onClick={create}
          disabled={loading || !shop.shop_name.trim()}
          style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            padding: '16px 0',
            marginTop: 24,
            opacity: loading || !shop.shop_name.trim() ? 0.5 : 1
          }}
        >
          {loading ? 'Creating Shop...' : 'Create Shop'}
        </button>

        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16, 
          textAlign: 'center',
          marginTop: 24
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            🎉 You're almost ready to start selling!
          </p>
        </div>
      </div>
    </div>
  );
}