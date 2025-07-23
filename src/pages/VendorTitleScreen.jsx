// src/pages/VendorTitleScreen.jsx
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function VendorTitleScreen() {
  const navigate = useNavigate();

  return (
    <div className="mobile-screen fade-in">
      <div className="status-bar">
        <span className="time">9:41</span>
        <span className="battery">🔋</span>
      </div>
      <div className="screen-content text-center">
        <div 
          className="logo-box" 
          style={{
            background: 'var(--primary-gradient)',
            width: 100,
            height: 100,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: '0 10px 24px rgba(252, 100, 79, 0.3)'
          }}
        >
          <span style={{ fontSize: 44, color: '#fff' }}>🏪</span>
        </div>

        <h1 className="title mb-xs" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Welcome Vendor
        </h1>

        <p className="subtitle mb-lg" style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>
          Manage your shop with Habrio
        </p>

        <div style={{ marginBottom: 40 }}>
          <div style={{ 
            background: 'var(--background-soft)', 
            borderRadius: 16, 
            padding: 24, 
            marginBottom: 24 
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
              🎯 What you can do
            </h3>
            <ul style={{ textAlign: 'left', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>📦 Manage inventory & add items</li>
              <li>📋 Handle customer orders</li>
              <li>💰 Track earnings & withdraw funds</li>
              <li>📊 View analytics & insights</li>
            </ul>
          </div>
        </div>

        <button 
          className="btn btn-primary btn-full btn-large" 
          onClick={() => navigate('/login')}
          style={{ 
            fontSize: 18, 
            fontWeight: 600, 
            padding: '16px 0',
            marginBottom: 16
          }}
        >
          Get Started →
        </button>

        <p style={{ 
          fontSize: 12, 
          color: 'var(--text-tertiary)', 
          opacity: 0.7 
        }}>
          Built with ❤️ for local sellers
        </p>
      </div>
    </div>
  );
}