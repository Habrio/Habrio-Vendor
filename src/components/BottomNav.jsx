// src/components/BottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/home' },
    { icon: '🏪', label: 'Shop', path: '/shop' },
    { icon: '📦', label: 'Items', path: '/items' },
    { icon: '📋', label: 'Orders', path: '/orders' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '375px',
        background: 'white',
        borderTop: '1px solid var(--divider)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 1000
      }}
    >
      {navItems.map(item => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color:
              location.pathname === item.path
                ? 'var(--primary-color)'
                : 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}