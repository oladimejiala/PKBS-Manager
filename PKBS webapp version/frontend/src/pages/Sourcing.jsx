import React, { useEffect, useState } from 'react';
import { fetchSourcing } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Sourcing = () => {
  const [sourcing, setSourcing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSourcing = async () => {
      try {
        const data = await fetchSourcing();
        setSourcing(data);
      } catch (error) {
        console.error('Failed to fetch sourcing data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSourcing();
  }, []);

  return (
    <div className="sourcing-page">
      <h1>Sourcing Records</h1>
      <button onClick={() => navigate('/sourcing/new')} style={buttonStyle}>
        + Add New Source
      </button>

      {loading ? (
        <p>Loading sourcing data...</p>
      ) : sourcing.length === 0 ? (
        <p>No sourcing records found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Supplier</th>
              <th style={thStyle}>Quantity (kg)</th>
              <th style={thStyle}>Price (₦)</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sourcing.map((source) => (
              <tr key={source.id || source._id} style={trStyle}>
                <td style={tdStyle}>
                  {new Date(source.timestamp).toLocaleDateString()}
                </td>
                <td style={tdStyle}>{source.supplierName || '-'}</td>
                <td style={tdStyle}>{source.quantity ?? '-'}</td>
                <td style={tdStyle}>
                  {source.price ? source.price.toLocaleString() : '-'}
                </td>
                <td style={tdStyle}>{source.location?.name || '-'}</td>
                <td style={tdStyle}>{source.status || '-'}</td>
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
  backgroundColor: '#28a745',
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

export default Sourcing;
