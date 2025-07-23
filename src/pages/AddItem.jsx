// src/pages/AddItem.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function AddItem() {
  const [item, setItem] = useState({
    title: '',
    brand: '',
    description: '',
    price: '',
    mrp: '',
    quantity_in_stock: '',
    unit: 'pcs',
    category: '',
    tags: '',
    sku: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  const units = [
    'pcs', 'kg', 'grams', 'liters', 'ml', 'packets', 'boxes', 'bottles', 'cans', 'dozen'
  ];

  const categories = [
    'grocery', 'dairy', 'vegetables', 'fruits', 'snacks', 'beverages', 
    'bakery', 'frozen', 'personal-care', 'household', 'baby-care', 'other'
  ];

  const handleInputChange = (field, value) => {
    setItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!item.title.trim()) {
      alert('Product title is required');
      return false;
    }
    if (!item.price || parseFloat(item.price) <= 0) {
      alert('Please enter a valid price');
      return false;
    }
    if (item.mrp && parseFloat(item.mrp) < parseFloat(item.price)) {
      alert('MRP cannot be less than selling price');
      return false;
    }
    if (!item.quantity_in_stock || parseInt(item.quantity_in_stock) < 0) {
      alert('Please enter a valid stock quantity');
      return false;
    }
    return true;
  };

  const saveItem = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const itemData = {
        ...item,
        price: parseFloat(item.price),
        mrp: item.mrp ? parseFloat(item.mrp) : null,
        quantity_in_stock: parseInt(item.quantity_in_stock),
        discount: item.mrp && item.price ? 
          Math.round(((parseFloat(item.mrp) - parseFloat(item.price)) / parseFloat(item.mrp)) * 100) : null
      };

      const res = await fetch(`${backend}/item/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(itemData)
      });

      const data = await res.json();

      if (data.status === 'success') {
        navigate('/items');
        // Could show success message here
      } else {
        alert(data.message || 'Failed to add item');
      }
    } catch (error) {
      console.error('Add item error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-content" style={{ paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={() => navigate('/items')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 18,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            marginRight: 12
          }}
        >
          ←
        </button>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          ➕ Add New Item
        </h2>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Basic Info */}
        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16,
          border: '1px solid var(--divider)'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
            📝 Basic Information
          </h3>

          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g., Basmati Rice 1kg"
              value={item.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g., Tata, Amul, etc."
              value={item.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Brief description about the product..."
              value={item.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>
        </div>

        {/* Pricing */}
        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16,
          border: '1px solid var(--divider)'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
            💰 Pricing
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Selling Price *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                  fontSize: 14
                }}>
                  ₹
                </span>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0.00"
                  value={item.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: 28 }}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">MRP (Optional)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                  fontSize: 14
                }}>
                  ₹
                </span>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0.00"
                  value={item.mrp}
                  onChange={(e) => handleInputChange('mrp', e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: 28 }}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          {item.mrp && item.price && parseFloat(item.mrp) > parseFloat(item.price) && (
            <div style={{ 
              background: '#D1FAE5', 
              border: '1px solid #A7F3D0',
              borderRadius: 8, 
              padding: 8, 
              marginTop: 8,
              fontSize: 12,
              color: '#059669'
            }}>
              💡 Discount: {Math.round(((parseFloat(item.mrp) - parseFloat(item.price)) / parseFloat(item.mrp)) * 100)}% off
            </div>
          )}
        </div>

        {/* Inventory */}
        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16,
          border: '1px solid var(--divider)'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
            📦 Inventory
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                className="form-input"
                type="number"
                placeholder="0"
                value={item.quantity_in_stock}
                onChange={(e) => handleInputChange('quantity_in_stock', e.target.value)}
                disabled={loading}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <select
                className="form-input"
                value={item.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
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
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Categories & Tags */}
        <div style={{ 
          background: 'var(--background-soft)', 
          borderRadius: 12, 
          padding: 16,
          border: '1px solid var(--divider)'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
            🏷️ Categories & Tags
          </h3>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={item.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
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
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">SKU/Product Code (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g., BR001, RICE-BAS-1KG"
              value={item.sku}
              onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g., organic, premium, imported (comma separated)"
              value={item.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              disabled={loading}
            />
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Separate multiple tags with commas
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginTop: 24 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/items')}
            disabled={loading}
            style={{ 
              background: 'var(--background-soft)',
              border: '1px solid var(--divider)',
              color: 'var(--text-primary)',
              fontSize: 16,
              padding: '16px 0'
            }}
          >
            Cancel
          </button>

          <button
            className={`btn btn-primary btn-large ${loading ? 'opacity-50' : ''}`}
            onClick={saveItem}
            disabled={loading || !item.title.trim() || !item.price}
            style={{ 
              fontSize: 16,
              padding: '16px 0',
              opacity: loading || !item.title.trim() || !item.price ? 0.5 : 1
            }}
          >
            {loading ? 'Adding Item...' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}