import React, { useEffect, useState } from 'react';
import { fetchSales } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await fetchSales();
        setSales(data);
      } catch (error) {
        console.error('Failed to fetch sales:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, []);

  return (
    <div className="sales-page">
      <h1>Sales Records</h1>
      <button onClick={() => navigate('/sales/new')} style={buttonStyle}>
        + Add New Sale
      </button>

      {loading ? (
        <p>Loading sales data...</p>
      ) : sales.length === 0 ? (
        <p>No sales records found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Quantity (kg)</th>
              <th style={thStyle}>Amount (₦)</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id || sale._id} style={trStyle}>
                <td style={tdStyle}>
                  {new Date(sale.timestamp).toLocaleDateString()}
                </td>
                <td style={tdStyle}>{sale.productName || '-'}</td>
                <td style={tdStyle}>{sale.quantity ?? '-'}</td>
                <td style={tdStyle}>
                  {sale.price ? sale.price.toLocaleString() : '-'}
                </td>
                <td style={tdStyle}>{sale.customerName || '-'}</td>
                <td style={tdStyle}>{sale.status || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const buttonStyle = {
  marginBottom: '1rem',
  padding: '0.6rem 1.2rem',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  borderBottom: '2px solid #ccc',
  textAlign: 'left',
  padding: '0.5rem 1rem',
};

const tdStyle = {
  padding: '0.5rem 1rem',
};

const trStyle = {
  borderBottom: '1px solid #eee',
};

export default Sales;
