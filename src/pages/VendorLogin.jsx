// src/pages/VendorLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorLogin() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;

  const sendOtp = async () => {
    if (!/^[0-9]{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backend}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: '+91' + phone }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        navigate('/otp', { state: { phone } });
      } else {
        alert(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendOtp();
    }
  };

  return (
    <div className="mobile-screen fade-in">
      <div className="status-bar">
        <span className="time">9:41</span>
        <span className="battery">🔋</span>
      </div>

      <div className="screen-content">
        <div style={{ textAlign: 'center', paddingTop: 40, marginBottom: 40 }}>
          <div 
            style={{
              background: 'var(--primary-gradient)',
              width: 80,
              height: 80,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 20px rgba(252, 100, 79, 0.25)'
            }}
          >
            <span style={{ fontSize: 36, color: '#fff' }}>🏪</span>
          </div>

          <h2 className="title text-center mb-lg" style={{ fontSize: 24, fontWeight: 600 }}>
            Vendor Login
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
            Enter your phone number to continue
          </p>
        </div>

        <div className="form-group mb-md">
          <label className="form-label" style={{ marginBottom: 8, fontWeight: 500 }}>
            Phone Number
          </label>
          <div className="phone-input-group">
            <div className="country-code">+91</div>
            <input
              type="tel"
              className="phone-input"
              placeholder="9876543210"
              maxLength="10"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{ 
                border: 'none', 
                background: 'transparent', 
                flex: 1, 
                fontSize: 16,
                padding: '12px 8px'
              }}
            />
          </div>
        </div>

        <button 
          className={`btn btn-primary btn-full btn-large ${loading ? 'opacity-50' : ''}`}
          onClick={sendOtp}
          disabled={loading || phone.length !== 10}
          style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            padding: '16px 0',
            marginBottom: 24,
            opacity: loading || phone.length !== 10 ? 0.5 : 1
          }}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16, 
          textAlign: 'center' 
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            🔒 Your phone number is safe with us
          </p>
        </div>
      </div>
    </div>
  );
}