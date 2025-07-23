// src/pages/Items.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, available, unavailable
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await fetch(`${backend}/item/my`, {
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setItems(data.data || []);
      } else {
        console.error('Failed to load items:', data.message);
      }
    } catch (error) {
      console.error('Items loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemAvailability = async (itemId) => {
    try {
      const res = await fetch(`${backend}/item/${itemId}/toggle`, {
        method: 'POST',
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, is_available: !item.is_available } : item
        ));
      } else {
        alert(data.message || 'Failed to update item availability');
      }
    } catch (error) {
      console.error('Toggle availability error:', error);
      alert('Network error. Please try again.');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'available' && item.is_available) ||
      (filter === 'unavailable' && !item.is_available);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: items.length,
    available: items.filter(item => item.is_available).length,
    outOfStock: items.filter(item => item.quantity_in_stock === 0).length
  };

  if (loading) {
    return (
      <div className="screen-content">
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            📦 My Items
          </h2>
          <button
            onClick={() => navigate('/items/add')}
            style={{
              background: 'var(--primary-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + Add Item
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          <div style={{ 
            background: 'var(--background-soft)', 
            border: '1px solid var(--divider)',
            borderRadius: 8, 
            padding: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Total Items</div>
          </div>
          <div style={{ 
            background: 'var(--background-soft)', 
            border: '1px solid var(--divider)',
            borderRadius: 8, 
            padding: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-color)' }}>
              {stats.available}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Available</div>
          </div>
          <div style={{ 
            background: stats.outOfStock > 0 ? '#FFF3CD' : 'var(--background-soft)', 
            border: `1px solid ${stats.outOfStock > 0 ? '#FFEAA7' : 'var(--divider)'}`,
            borderRadius: 8, 
            padding: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: stats.outOfStock > 0 ? '#B8860B' : 'var(--text-primary)' }}>
              {stats.outOfStock}
            </div>
            <div style={{ fontSize: 11, color: stats.outOfStock > 0 ? '#B8860B' : 'var(--text-secondary)' }}>
              Out of Stock
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--divider)',
              borderRadius: 8,
              background: 'var(--background-soft)',
              fontSize: 14,
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'available', label: 'Available' },
            { key: 'unavailable', label: 'Unavailable' }
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
                cursor: 'pointer'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/items/add')}
          style={{ fontSize: 14, padding: '12px 0' }}
        >
          ➕ Add Item
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/items/bulk-upload')}
          style={{ 
            fontSize: 14, 
            padding: '12px 0',
            background: 'var(--background-soft)',
            border: '1px solid var(--divider)',
            color: 'var(--text-primary)'
          }}
        >
          📊 Bulk Upload
        </button>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 32, 
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {items.length === 0 ? '📦' : '🔍'}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
            {items.length === 0 ? 'No items added yet' : 'No matching items found'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {items.length === 0 ? 'Start adding items to your inventory' : 'Try adjusting your search or filter'}
          </p>
          {items.length === 0 && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/items/add')}
              style={{ fontSize: 14, padding: '8px 16px' }}
            >
              Add Your First Item
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                border: '1px solid var(--divider)',
                borderRadius: 12,
                padding: 16,
                background: 'var(--background)',
                opacity: item.is_available ? 1 : 0.7
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: item.is_available ? '#059669' : '#DC2626',
                        background: item.is_available ? '#D1FAE5' : '#FEE2E2',
                        padding: '2px 6px',
                        borderRadius: 8
                      }}
                    >
                      {item.is_available ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-color)' }}>
                      ₹{item.price}
                    </span>
                    {item.mrp && item.mrp > item.price && (
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                        ₹{item.mrp}
                      </span>
                    )}
                    <span style={{ 
                      fontSize: 12, 
                      color: item.quantity_in_stock > 0 ? 'var(--text-secondary)' : '#DC2626',
                      fontWeight: item.quantity_in_stock === 0 ? 600 : 400
                    }}>
                      Stock: {item.quantity_in_stock} {item.unit}
                    </span>
                  </div>

                  {item.category && (
                    <span style={{
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      background: 'var(--background-soft)',
                      padding: '2px 8px',
                      borderRadius: 12,
                      marginRight: 8
                    }}>
                      {item.category}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    style={{
                      background: item.is_available ? '#FEE2E2' : '#D1FAE5',
                      color: item.is_available ? '#DC2626' : '#059669',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {item.is_available ? 'Hide' : 'Show'}
                  </button>

                  <button
                    onClick={() => navigate(`/items/${item.id}/edit`)}
                    style={{
                      background: 'var(--background-soft)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--divider)',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}