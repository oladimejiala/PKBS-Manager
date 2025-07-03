import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LogisticsForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    vehicleNumber: '',
    borderCrossing: '',
    logisticsCost: '',
    logisticsDate: new Date(),
    logisticsTime: new Date(),
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Simple validation
  const validate = () => {
    const newErrors = {};
    if (!formData.driverName.trim()) newErrors.driverName = 'Driver name is required';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.borderCrossing.trim()) newErrors.borderCrossing = 'Border crossing info is required';
    if (!formData.logisticsCost || isNaN(formData.logisticsCost)) newErrors.logisticsCost = 'Valid cost is required';
    if (!formData.logisticsDate) newErrors.logisticsDate = 'Date is required';
    if (!formData.logisticsTime) newErrors.logisticsTime = 'Time is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, logisticsDate: date }));
  };

  const handleTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, logisticsTime: time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Combine date & time into ISO datetime string for backend
    const combinedDateTime = new Date(
      formData.logisticsDate.getFullYear(),
      formData.logisticsDate.getMonth(),
      formData.logisticsDate.getDate(),
      formData.logisticsTime.getHours(),
      formData.logisticsTime.getMinutes()
    ).toISOString();

    const payload = {
      driverName: formData.driverName.trim(),
      vehicleNumber: formData.vehicleNumber.trim(),
      borderCrossing: formData.borderCrossing.trim(),
      logisticsCost: parseFloat(formData.logisticsCost),
      logisticsDateTime: combinedDateTime,
      notes: formData.notes.trim(),
    };

    try {
      const response = await fetch('/api/logistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit logistics data');
      }

      const result = await response.json();
      setLoading(false);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setLoading(false);
      setSubmitError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="logistics-form">
      <h2>Logistics Details</h2>

      <label>
        Driver Name:
        <input
          type="text"
          name="driverName"
          value={formData.driverName}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.driverName && <span className="error">{errors.driverName}</span>}
      </label>

      <label>
        Vehicle Number:
        <input
          type="text"
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.vehicleNumber && <span className="error">{errors.vehicleNumber}</span>}
      </label>

      <label>
        Border Crossing:
        <input
          type="text"
          name="borderCrossing"
          value={formData.borderCrossing}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.borderCrossing && <span className="error">{errors.borderCrossing}</span>}
      </label>

      <label>
        Logistics Cost (₦):
        <input
          type="number"
          name="logisticsCost"
          value={formData.logisticsCost}
          onChange={handleChange}
          step="0.01"
          min="0"
          disabled={loading}
        />
        {errors.logisticsCost && <span className="error">{errors.logisticsCost}</span>}
      </label>

      <label>
        Logistics Date:
        <DatePicker
          selected={formData.logisticsDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          disabled={loading}
        />
        {errors.logisticsDate && <span className="error">{errors.logisticsDate}</span>}
      </label>

      <label>
        Logistics Time:
        <DatePicker
          selected={formData.logisticsTime}
          onChange={handleTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="HH:mm"
          disabled={loading}
        />
        {errors.logisticsTime && <span className="error">{errors.logisticsTime}</span>}
      </label>

      <label>
        Notes:
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional info (optional)"
          disabled={loading}
        />
      </label>

      {submitError && <p className="submit-error">{submitError}</p>}

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default LogisticsForm;
