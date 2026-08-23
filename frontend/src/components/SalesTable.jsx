import React from 'react';

export default function SalesTable({ sales, onDelete }) {
  return (
    <div style={containerStyle}>
      <h3>সাম্প্রতিক বিক্রির তালিকা</h3>
      {sales && sales.length === 0 ? (
        <p style={{ color: '#666' }}>কোনো বিক্রির তথ্য পাওয়া যায়নি।</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={trHeaderStyle}>
                <th style={thStyle}>তারিখ</th>
                <th style={thStyle}>কাউন্টার/স্টাফ</th>
                <th style={thStyle}>বিবরণ</th>
                <th style={thStyle}>পরিমাণ (টাকা)</th>
                <th style={thStyle}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {sales && sales.map((sale, index) => (
                <tr key={sale.id || index} style={trBodyStyle}>
                  <td style={tdStyle}>{sale.date || '-'}</td>
                  <td style={tdStyle}>{sale.counter || sale.staff || '-'}</td>
                  <td style={tdStyle}>{sale.description || '-'}</td>
                  <td style={tdStyle}>৳ {sale.amount || 0}</td>
                  <td style={tdStyle}>
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(sale.id)} 
                        style={deleteBtnStyle}
                      >
                        রিমুভ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  marginBottom: '1.5rem',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
  textAlign: 'left',
};

const trHeaderStyle = {
  backgroundColor: '#f3f4f6',
  borderBottom: '2px solid #e5e7eb',
};

const thStyle = {
  padding: '0.75rem 1rem',
  color: '#374151',
  fontWeight: '600',
  fontSize: '0.9rem',
};

const trBodyStyle = {
  borderBottom: '1px solid #e5e7eb',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  color: '#4b5563',
  fontSize: '0.9rem',
};

const deleteBtnStyle = {
  padding: '0.25rem 0.5rem',
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: '600',
};