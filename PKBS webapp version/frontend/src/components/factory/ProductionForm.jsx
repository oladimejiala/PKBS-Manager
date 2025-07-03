import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { submitProductionData } from '../services/factoryService';
import FingerprintScanner from './FingerprintScanner';
import LocationPicker from './LocationPicker';
import '../styles/ProductionForm.css';

const ProductionForm = () => {
  const { logisticsId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    logisticsId,
    quantityProcessed: '',
    pkoExtracted: '',
    pkcExtracted: '',
    processingCost: '',
    startTime: '',
    endTime: '',
    qualityMetrics: {
      moistureContent: '',
      ffa: ''
    },
    qualityNotes: '',
    location: null,
    receiverThumbprint: null,
    staffThumbprint: null
  });

  useEffect(() => {
    const now = new Date().toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, startTime: now }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('qualityMetrics.')) {
      const metric = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        qualityMetrics: {
          ...prev.qualityMetrics,
          [metric]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && !validateProductionData()) return;
    if (step === 2 && !formData.endTime) {
      setError('Please set an end time.');
      return;
    }
    if (step === 3 && !formData.location) {
      setError('Please select a processing location.');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const validateProductionData = () => {
    const { quantityProcessed, pkoExtracted, pkcExtracted, startTime } = formData;

    if (!quantityProcessed || isNaN(quantityProcessed)) {
      setError('Please enter a valid processed quantity');
      return false;
    }

    if (!pkoExtracted || isNaN(pkoExtracted)) {
      setError('Please enter valid PKO quantity');
      return false;
    }

    if (!pkcExtracted || isNaN(pkcExtracted)) {
      setError('Please enter valid PKC quantity');
      return false;
    }

    if (!startTime) {
      setError('Please set processing start time');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const processingHours =
        (new Date(formData.endTime) - new Date(formData.startTime)) / (1000 * 60 * 60);

      const completeData = {
        ...formData,
        processingTime: processingHours.toFixed(2),
        staffId: JSON.parse(localStorage.getItem('user'))?.id
      };

      await submitProductionData(completeData);
      navigate('/factory/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to submit production data');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="production-form-step">
            <h3>Production Details</h3>

            <div className="form-group">
              <label>Quantity Processed (kg)</label>
              <input
                type="number"
                name="quantityProcessed"
                value={formData.quantityProcessed}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>PKO Extracted (kg)</label>
                <input
                  type="number"
                  name="pkoExtracted"
                  value={formData.pkoExtracted}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div className="form-group">
                <label>PKC Extracted (kg)</label>
                <input
                  type="number"
                  name="pkcExtracted"
                  value={formData.pkcExtracted}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Processing Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Processing End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  min={formData.startTime}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Processing Cost (₦)</label>
              <input
                type="number"
                name="processingCost"
                value={formData.processingCost}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="production-form-step">
            <h3>Quality Control</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Moisture Content (%)</label>
                <input
                  type="number"
                  name="qualityMetrics.moistureContent"
                  value={formData.qualityMetrics.moistureContent}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Free Fatty Acid (FFA %)</label>
                <input
                  type="number"
                  name="qualityMetrics.ffa"
                  value={formData.qualityMetrics.ffa}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="qualityNotes"
                value={formData.qualityNotes}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="production-form-step">
            <h3>Processing Location</h3>
            <LocationPicker
              onLocationSelect={(loc) => {
                setFormData(prev => ({
                  ...prev,
                  location: {
                    type: 'Point',
                    coordinates: [loc.longitude, loc.latitude]
                  }
                }));
              }}
            />
            <div className="form-navigation">
              <button className="back-button" onClick={handleBack}>
                Back
              </button>
              <button className="next-button" onClick={handleNext} disabled={!formData.location}>
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <FingerprintScanner
            title="Receiver Verification"
            onCapture={(data) => setFormData({ ...formData, receiverThumbprint: data })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 5:
        return (
          <FingerprintScanner
            title="Your Verification"
            onCapture={(data) => {
              setFormData({ ...formData, staffThumbprint: data });
              handleSubmit();
            }}
            onBack={handleBack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="production-form-container">
      <div className="production-form-header">
        <h2>Factory Production Record</h2>
        <div className="step-indicator">Step {step} of 5</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {renderStep()}

      {step < 4 && step !== 3 && (
        <div className="form-navigation">
          {step > 1 && (
            <button className="back-button" onClick={handleBack} disabled={loading}>
              Back
            </button>
          )}
          <button
            className="next-button"
            onClick={handleNext}
            disabled={loading || (step === 2 && !formData.endTime)}
          >
            {loading ? 'Processing...' : step === 2 ? 'Next' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductionForm;
