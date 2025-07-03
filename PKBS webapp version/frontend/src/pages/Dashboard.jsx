import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.user);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await dispatch(fetchUserTransactions(user.id));
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadTransactions();
  }, [dispatch, user]);

  // Calculate simple stats
  const totalTransactions = transactions.length;
  const totalSourcing = transactions.filter(t => t.type === 'sourcing').length;
  const totalSales = transactions.filter(t => t.type === 'sale').length;

  return (
    <div className="dashboard-page">
      <h1>Welcome back, {user?.name || 'User'}!</h1>

      <section className="dashboard-stats" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={statCardStyle}>
          <h3>Total Transactions</h3>
          <p>{loading ? 'Loading...' : totalTransactions}</p>
        </div>
        <div className="stat-card" style={statCardStyle}>
          <h3>Sourcing Transactions</h3>
          <p>{loading ? 'Loading...' : totalSourcing}</p>
        </div>
        <div className="stat-card" style={statCardStyle}>
          <h3>Sales Transactions</h3>
          <p>{loading ? 'Loading...' : totalSales}</p>
        </div>
      </section>

      <section className="recent-transactions">
        <h2>Recent Transactions</h2>
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Quantity (kg)</th>
                <th style={thStyle}>Price (₦)</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(tx => (
                <tr key={tx._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td style={tdStyle}>{tx.type}</td>
                  <td style={tdStyle}>{tx.quantity ?? '-'}</td>
                  <td style={tdStyle}>{tx.price ? tx.price.toLocaleString() : '-'}</td>
                  <td style={tdStyle}>{tx.status || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="quick-actions" style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/sales/new')} style={buttonStyle}>Add New Sale</button>
          <button onClick={() => navigate('/sourcing/new')} style={buttonStyle}>Add New Sourcing</button>
          <button onClick={() => navigate('/reports')} style={buttonStyle}>View Reports</button>
        </div>
      </section>
    </div>
  );
};

const statCardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '1rem 1.5rem',
  borderRadius: '8px',
  textAlign: 'center',
  flex: '1',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
};

const thStyle = {
  textAlign: 'left',
  borderBottom: '2px solid #ccc',
  padding: '0.5rem 1rem',
};

const tdStyle = {
  padding: '0.5rem 1rem',
};

const buttonStyle = {
  padding: '0.7rem 1.2rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Dashboard;
