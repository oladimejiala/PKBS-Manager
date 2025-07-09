// This file is part of the PKBS web application.
// It implements the login functionality for staff members using fingerprint verification.
// The code includes a form for entering a phone number and capturing fingerprint data.
// The login process is handled by the `loginUser` service, which interacts with the backend
// to authenticate the user. Upon successful login, the user is redirected to the dashboard.
// SPDX-License-Identifier: GPL-3.0-or-later
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/auth';
import FingerprintScanner from '../components/common/FingerprintScanner';

const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [fingerprintData, setFingerprintData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await dispatch(loginUser({ phone, fingerprintData }));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Staff Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Fingerprint Verification</label>
          <FingerprintScanner 
            onCapture={setFingerprintData}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading || !fingerprintData}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
EOF
