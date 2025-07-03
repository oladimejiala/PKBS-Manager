// /components/auth/RegisterForm.js
import React, { useState, useEffect } from 'react';
import { getLocation } from '../../services/geolocation';
import FingerprintScanner from '../common/FingerprintScanner';
import api from '../../services/api';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', token: '' });
  const [location, setLocation] = useState({});
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    getLocation().then(setLocation);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, fingerprintData: fingerprint, location };
    const res = await api.post('/auth/register', payload);
    alert(res.data.msg);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Full Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input placeholder="Phone Number" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
      <input placeholder="Access Token" onChange={e => setFormData({ ...formData, token: e.target.value })} />
      <FingerprintScanner onCapture={setFingerprint} />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
