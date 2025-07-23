// src/pages/BulkUpload.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/App.css';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('auth_token');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please select a valid CSV or Excel file');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${backend}/item/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: formData
      });

      const data = await res.json();

      if (data.status === 'success') {
        setUploadResult({
          success: true,
          message: data.message
        });
        setFile(null);
        // Reset file input
        document.getElementById('file-input').value = '';
      } else {
        setUploadResult({
          success: false,
          message: data.message || 'Upload failed'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template content
    const csvContent = `title,brand,description,price,mrp,quantity_in_stock,unit,category,tags,sku
Basmati Rice 1kg,India Gate,Premium quality basmati rice,120,150,50,kg,grocery,"organic,premium",RICE001
Amul Milk 1L,Amul,Fresh toned milk,52,55,30,liters,dairy,"fresh,healthy",MILK001
Maggi Noodles,Nestle,2-minute masala noodles,14,16,100,packets,snacks,"instant,tasty",NOOD001`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'items_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
          📊 Bulk Upload Items
        </h2>
      </div>

      {/* Instructions */}
      <div style={{ 
        background: 'var(--background-soft)', 
        borderRadius: 12, 
        padding: 20,
        border: '1px solid var(--divider)',
        marginBottom: 24
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
          📋 How to use Bulk Upload
        </h3>

        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: 8 }}>
            <strong>Step 1:</strong> Download the template CSV file below
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Step 2:</strong> Fill in your product details in the template
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Step 3:</strong> Upload the completed file
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>Required fields:</strong> title, price
          </p>

          <button
            onClick={downloadTemplate}
            style={{
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📥 Download Template
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div style={{ 
        background: 'var(--background-soft)', 
        borderRadius: 12, 
        padding: 20,
        border: '1px solid var(--divider)',
        marginBottom: 24
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
          📤 Upload Your File
        </h3>

        <div style={{ marginBottom: 16 }}>
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{
              width: '100%',
              padding: 12,
              border: '2px dashed var(--divider)',
              borderRadius: 8,
              background: 'var(--background)',
              fontSize: 14,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
            Supported formats: CSV, XLSX, XLS (Max size: 5MB)
          </p>
        </div>

        {file && (
          <div style={{ 
            background: '#D1FAE5', 
            border: '1px solid #A7F3D0',
            borderRadius: 8, 
            padding: 12, 
            marginBottom: 16,
            fontSize: 14,
            color: '#059669'
          }}>
            📁 Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}

        <button
          onClick={uploadFile}
          disabled={!file || uploading}
          style={{
            background: !file || uploading ? '#9CA3AF' : 'var(--primary-gradient)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: !file || uploading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {uploading ? '⏳ Uploading...' : '🚀 Upload Items'}
        </button>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div style={{ 
          background: uploadResult.success ? '#D1FAE5' : '#FEE2E2', 
          border: `1px solid ${uploadResult.success ? '#A7F3D0' : '#FECACA'}`,
          borderRadius: 12, 
          padding: 20,
          marginBottom: 24
        }}>
          <div style={{ 
            fontSize: 48, 
            textAlign: 'center', 
            marginBottom: 16 
          }}>
            {uploadResult.success ? '✅' : '❌'}
          </div>

          <h3 style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            marginBottom: 8, 
            color: uploadResult.success ? '#059669' : '#DC2626',
            textAlign: 'center'
          }}>
            {uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}
          </h3>

          <p style={{ 
            fontSize: 14, 
            color: uploadResult.success ? '#059669' : '#DC2626',
            textAlign: 'center',
            marginBottom: uploadResult.success ? 16 : 0
          }}>
            {uploadResult.message}
          </p>

          {uploadResult.success && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => navigate('/items')}
                style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View Items →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div style={{ 
        background: 'var(--background-soft)', 
        borderRadius: 12, 
        padding: 20,
        border: '1px solid var(--divider)'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
          💡 Tips for successful upload
        </h3>

        <ul style={{ 
          fontSize: 14, 
          color: 'var(--text-secondary)', 
          lineHeight: 1.6,
          paddingLeft: 20,
          margin: 0
        }}>
          <li>Keep column headers exactly as in the template</li>
          <li>Use numbers for price and quantity fields</li>
          <li>Categories should match: grocery, dairy, vegetables, etc.</li>
          <li>Separate multiple tags with commas</li>
          <li>SKU codes should be unique for each item</li>
          <li>Price should be greater than 0</li>
        </ul>
      </div>
    </div>
  );
}