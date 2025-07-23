// src/pages/VendorProfileSetup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorProfileSetup() {
  const [profile, setProfile] = useState({
    business_name: '',
    business_type: 'grocery',
    gst_number: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  const businessTypes = [
    'grocery',
    'pharmacy',
    'electronics',
    'clothing',
    'restaurant',
    'bakery',
    'stationery',
    'hardware',
    'other'
  ];

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async () => {
    const { business_name, business_type, address } = profile;

    if (!business_name.trim() || !business_type.trim() || !address.trim()) {
      alert('Please fill all required fields (Business Name, Type, and Address)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backend}/vendor/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (data.status === 'success') {
        navigate('/create-shop');
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Profile setup error:', error);
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
            <span style={{ fontSize: 28, color: '#fff' }}>🏢</span>
          </div>

          <h2 className="title text-center mb-lg" style={{ fontSize: 24, fontWeight: 600 }}>
            Business Profile
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Tell us about your business
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Business Name *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your business name"
            value={profile.business_name}
            onChange={(e) => handleInputChange('business_name', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Business Type *</label>
          <select
            className="form-input"
            value={profile.business_type}
            onChange={(e) => handleInputChange('business_type', e.target.value)}
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
            {businessTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">GST Number (Optional)</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter GST number if applicable"
            value={profile.gst_number}
            onChange={(e) => handleInputChange('gst_number', e.target.value.toUpperCase())}
            disabled={loading}
            maxLength="15"
          />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            Format: 22AAAAA0000A1Z5
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Business Address *</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Enter your complete business address"
            value={profile.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={loading}
            style={{ 
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        </div>

        <button 
          className={`btn btn-primary btn-full btn-large ${loading ? 'opacity-50' : ''}`}
          onClick={submit}
          disabled={loading || !profile.business_name.trim() || !profile.business_type.trim() || !profile.address.trim()}
          style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            padding: '16px 0',
            marginTop: 24,
            opacity: loading || !profile.business_name.trim() || !profile.business_type.trim() || !profile.address.trim() ? 0.5 : 1
          }}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>

        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16, 
          textAlign: 'center',
          marginTop: 24
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            📋 This information helps customers find and trust your business
          </p>
        </div>
      </div>
    </div>
  );
}