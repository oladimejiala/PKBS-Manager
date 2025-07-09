import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyFingerprint } from 'services/auth';
import '../styles/FingerprintScanner.css'; // FIXED path
const FingerprintScanner = ({ title, onCapture, onBack, required = true }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleScan = async () => {
    setScanning(true);
    setError(null);

    try {
      const fingerprintData = await mockFingerprintScan();
      const isValid = await verifyFingerprint(fingerprintData);

      if (isValid) {
        onCapture(fingerprintData);
      } else {
        throw new Error('Fingerprint verification failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
      setRetryCount((prev) => prev + 1);
    } finally {
      setScanning(false);
    }
  };

  const mockFingerprintScan = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomFingerprint = Array(64)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('');
        resolve(randomFingerprint);
      }, 1500);
    });
  };

  useEffect(() => {
    if (required) handleScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [required]); // ADDED dependency

  return (
    <div className="fingerprint-scanner">
      <div className="scanner-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            &larr; Back
          </button>
        )}
        <h2>{title || 'Fingerprint Verification'}</h2>
      </div>

      <div className={`scanner-body ${scanning ? 'scanning' : ''}`}>
        <div className="fingerprint-icon">
          {scanning ? (
            <div className="scan-animation" />
          ) : (
            <svg viewBox="0 0 100 100">
              <path d="M50,10A40,40 0 0,1 90,50A40,40 0 0,1 50,90A40,40 0 0,1 10,50A40,40 0 0,1 50,10Z" />
              <path d="M30,50Q50,30 70,50Q50,70 30,50Z" />
            </svg>
          )}
        </div>

        <div className="status-message">
          {scanning ? (
            <p>Scanning fingerprint...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <p>Place your finger on the scanner</p>
          )}
        </div>

        {!scanning && (
          <div className="scanner-actions">
            {error && retryCount < 3 && (
              <button className="retry-button" onClick={handleScan}>
                Retry Scan
              </button>
            )}
            {!required && (
              <button className="skip-button" onClick={() => navigate('/dashboard')}>
                Skip Verification
              </button>
            )}
          </div>
        )}
      </div>

      <div className="scanner-footer">
        <p>PKBS uses biometric data for secure authentication</p>
      </div>
    </div>
  );
};

export default FingerprintScanner;
