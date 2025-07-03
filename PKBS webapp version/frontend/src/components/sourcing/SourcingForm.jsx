import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSourcing } from '../../services/api'; // adjust path as needed
import PhotoUpload from './PhotoUpload';
import LocationPicker from './LocationPicker';
import FingerprintScanner from '../common/FingerprintScanner';

const SourcingForm = () => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierPhone: '',
    quantity: '',
    price: '',
    timestamp: new Date().toISOString().slice(0,16), // yyyy-MM-ddTHH:mm for datetime-local input
    paymentProof: null,
    goodsPhotos: [],
    location: null,
    supplierThumbprint: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateStep = () => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.supplierName.trim()) stepErrors.supplierName = 'Supplier name is required';
      if (!formData.supplierPhone.trim()) stepErrors.supplierPhone = 'Supplier phone is required';
      if (!formData.quantity || formData.quantity <= 0) stepErrors.quantity = 'Enter a valid quantity';
      if (!formData.price || formData.price <= 0) stepErrors.price = 'Enter a valid price';
      if (!formData.timestamp) stepErrors.timestamp = 'Date and time required';
    }
    if (currentStep === 2) {
      if (formData.goodsPhotos.length < 3) stepErrors.goodsPhotos = 'At least 3 goods photos required';
      if (!formData.paymentProof) stepErrors.paymentProof = 'Payment proof required';
    }
    if (currentStep === 3) {
      if (!formData.location) stepErrors.location = 'Location is required';
    }
    if (currentStep === 4) {
      if (!formData.supplierThumbprint) stepErrors.supplierThumbprint = 'Fingerprint verification required';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, key) => {
    const files = e.target.files;
    if (files.length > 0) {
      if (key === 'paymentProof') {
        setFormData(prev => ({ ...prev, paymentProof: files[0] }));
      }
    }
  };

  const handleGoodsPhotosUpload = (files) => {
    setFormData(prev => ({ ...prev, goodsPhotos: files }));
  };

  const handleLocationSelect = (loc) => {
    setFormData(prev => ({ ...prev, location: loc }));
  };

  const handleFingerprintCapture = (data) => {
    setFormData(prev => ({ ...prev, supplierThumbprint: data }));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const submitData = new FormData();
      submitData.append('supplierName', formData.supplierName);
      submitData.append('supplierPhone', formData.supplierPhone);
      submitData.append('quantity', formData.quantity);
      submitData.append('price', formData.price);
      submitData.append('timestamp', formData.timestamp);
      submitData.append('paymentProof', formData.paymentProof);
      formData.goodsPhotos.forEach((file, idx) => submitData.append('goodsPhotos', file));
      if(formData.location) {
        submitData.append('location', JSON.stringify(formData.location));
      }
      submitData.append('supplierThumbprint', formData.supplierThumbprint);

      await submitSourcing(submitData);

      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting sourcing form. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3>Supplier Info & Quantity</h3>
            <div className="form-group">
              <label>Supplier Name</label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                required
              />
              {errors.supplierName && <small className="error">{errors.supplierName}</small>}
            </div>

            <div className="form-group">
              <label>Supplier Phone</label>
              <input
                type="tel"
                name="supplierPhone"
                value={formData.supplierPhone}
                onChange={handleChange}
                required
              />
              {errors.supplierPhone && <small className="error">{errors.supplierPhone}</small>}
            </div>

            <div className="form-group">
              <label>Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
              {errors.quantity && <small className="error">{errors.quantity}</small>}
            </div>

            <div className="form-group">
              <label>Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
              {errors.price && <small className="error">{errors.price}</small>}
            </div>

            <div className="form-group">
              <label>Transaction Date & Time</label>
              <input
                type="datetime-local"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                required
              />
              {errors.timestamp && <small className="error">{errors.timestamp}</small>}
            </div>

            <button type="button" onClick={handleNext}>Next</button>
          </>
        );

      case 2:
        return (
          <>
            <h3>Documentation</h3>
            <PhotoUpload
              onUpload={handleGoodsPhotosUpload}
              requiredCount={3}
              existingFiles={formData.goodsPhotos}
            />
            {errors.goodsPhotos && <small className="error">{errors.goodsPhotos}</small>}

            <div className="form-group">
              <label>Payment Proof</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'paymentProof')}
                required
              />
              {errors.paymentProof && <small className="error">{errors.paymentProof}</small>}
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleNext}>Next</button>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3>Location Details</h3>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialLocation={formData.location}
            />
            {errors.location && <small className="error">{errors.location}</small>}

            <div className="form-actions">
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleNext}>Next</button>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h3>Supplier Verification</h3>
            <FingerprintScanner
              title="Supplier Thumbprint"
              onCapture={handleFingerprintCapture}
            />
            {errors.supplierThumbprint && <small className="error">{errors.supplierThumbprint}</small>}

            <div className="form-actions">
              <button type="button" onClick={handleBack}>Back</button>
              <button type="button" onClick={handleSubmit}>Submit</button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sourcing-form">
      <h2>Palm Kernel Sourcing</h2>
      <div className="step-indicator">Step {currentStep} of 4</div>
      {renderStep()}
    </div>
  );
};

export default SourcingForm;
