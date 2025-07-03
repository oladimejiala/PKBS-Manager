import React, { useEffect, useState } from 'react';
import { fetchFactories } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Factory = () => {
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFactories = async () => {
      try {
        const data = await fetchFactories();
        setFactories(data);
      } catch (error) {
        console.error('Failed to fetch factories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFactories();
  }, []);

  return (
    <div className="factory-page">
      <h1>Factories</h1>
      <button onClick={() => navigate('/factories/new')} style={buttonStyle}>
        + Add New Factory
      </button>

      {loading ? (
        <p>Loading factories...</p>
      ) : factories.length === 0 ? (
        <p>No factories found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Capacity (tons)</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((factory) => (
              <tr key={factory.id || factory._id} style={trStyle}>
                <td style={tdStyle}>{factory.name}</td>
                <td style={tdStyle}>{factory.location}</td>
                <td style={tdStyle}>{factory.capacity ?? '-'}</td>
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

export default Factory;
