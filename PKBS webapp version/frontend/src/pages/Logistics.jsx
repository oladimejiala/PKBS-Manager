import React, { useEffect, useState } from 'react';
import { fetchLogistics } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Logistics = () => {
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLogistics = async () => {
      try {
        const data = await fetchLogistics();
        setLogistics(data);
      } catch (error) {
        console.error('Failed to fetch logistics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLogistics();
  }, []);

  return (
    <div className="logistics-page">
      <h1>Logistics Overview</h1>
      <button onClick={() => navigate('/logistics/new')} style={buttonStyle}>
        + Add New Shipment
      </button>

      {loading ? (
        <p>Loading logistics data...</p>
      ) : logistics.length === 0 ? (
        <p>No logistics data found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Shipment ID</th>
              <th style={thStyle}>Origin</th>
              <th style={thStyle}>Destination</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Expected Delivery</th>
            </tr>
          </thead>
          <tbody>
            {logistics.map((shipment) => (
              <tr key={shipment.id || shipment._id} style={trStyle}>
                <td style={tdStyle}>{shipment.shipmentId || shipment._id}</td>
                <td style={tdStyle}>{shipment.origin}</td>
                <td style={tdStyle}>{shipment.destination}</td>
                <td style={tdStyle}>{shipment.status}</td>
                <td style={tdStyle}>
                  {shipment.expectedDelivery
                    ? new Date(shipment.expectedDelivery).toLocaleDateString()
                    : '-'}
                </td>
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

export default Logistics;
