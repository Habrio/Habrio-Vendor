// src/pages/VendorBasicOnboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorBasicOnboard() {
  const [form, setForm] = useState({
    name: '',
    city: '',
    society: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async () => {
    const { name, city, society } = form;

    if (!name.trim() || !city.trim() || !society.trim()) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backend}/onboarding/basic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          ...form,
          role: 'vendor'
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        navigate('/onboarding/profile');
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
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
            <span style={{ fontSize: 28, color: '#fff' }}>👤</span>
          </div>

          <h2 className="title text-center mb-lg" style={{ fontSize: 24, fontWeight: 600 }}>
            Tell us about yourself
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Help us set up your vendor profile
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">City *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your city"
            value={form.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Society/Area *</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your society or area"
            value={form.society}
            onChange={(e) => handleInputChange('society', e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          className={`btn btn-primary btn-full btn-large ${loading ? 'opacity-50' : ''}`}
          onClick={submit}
          disabled={loading || !form.name.trim() || !form.city.trim() || !form.society.trim()}
          style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            padding: '16px 0',
            marginTop: 24,
            opacity: loading || !form.name.trim() || !form.city.trim() || !form.society.trim() ? 0.5 : 1
          }}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>

        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16, 
          textAlign: 'center',
          marginTop: 24
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            🔒 Your information is secure with us
          </p>
        </div>
      </div>
    </div>
  );
}