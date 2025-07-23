// src/pages/VendorOtp.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorOtp() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const { state } = useLocation();
  const phone = state?.phone;
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!phone) {
      navigate('/login');
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [phone, navigate]);

  const verify = async () => {
    if (!/^[0-9]{6}$/.test(otp)) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backend}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: '+91' + phone, otp }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('auth_token', data.auth_token);

        if (data.basic_onboarding_done) {
          navigate('/home');
        } else {
          navigate('/onboarding/basic');
        }
      } else {
        alert(data.message || 'Incorrect OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
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
        setTimer(30);
        alert('OTP sent successfully!');
      } else {
        alert(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verify();
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
            <span style={{ fontSize: 36, color: '#fff' }}>📱</span>
          </div>

          <h2 className="title text-center mb-lg" style={{ fontSize: 24, fontWeight: 600 }}>
            Enter OTP
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>
            We've sent a 6-digit code to
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, marginBottom: 32 }}>
            +91 {phone}
          </p>
        </div>

        <div className="form-group mb-md">
          <input
            className="otp-input"
            maxLength="6"
            placeholder="------"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyPress={handleKeyPress}
            disabled={loading}
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 28,
              letterSpacing: 8,
              padding: 16,
              border: '2px solid var(--divider)',
              borderRadius: 12,
              background: 'var(--background-soft)',
              fontWeight: 600,
              marginBottom: 24
            }}
          />
        </div>

        <button 
          className={`btn btn-primary btn-full btn-large ${loading ? 'opacity-50' : ''}`}
          onClick={verify}
          disabled={loading || otp.length !== 6}
          style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            padding: '16px 0',
            marginBottom: 24,
            opacity: loading || otp.length !== 6 ? 0.5 : 1
          }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div style={{ textAlign: 'center' }}>
          {timer > 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Resend OTP in {timer}s
            </p>
          ) : (
            <button
              onClick={resendOtp}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Resend OTP
            </button>
          )}
        </div>

        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16, 
          textAlign: 'center',
          marginTop: 24
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
            💡 Didn't receive? Check spam or try resending
          </p>
        </div>
      </div>
    </div>
  );
}