import React, { useState } from 'react';

const SalesForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    productType: '',
    quantity: '',
    unitPrice: '',
    paymentStatus: 'Pending',
    saleDate: new Date().toISOString().slice(0, 10),  // yyyy-mm-dd
    saleTime: new Date().toTimeString().slice(0, 5),  // HH:mm
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Customer name is required';
    if (!formData.customerPhone.trim()) errs.customerPhone = 'Customer phone is required';
    if (!formData.productType.trim()) errs.productType = 'Product type is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) errs.quantity = 'Quantity must be > 0';
    if (!formData.unitPrice || Number(formData.unitPrice) <= 0) errs.unitPrice = 'Unit price must be > 0';
    if (!formData.saleDate) errs.saleDate = 'Sale date is required';
    if (!formData.saleTime) errs.saleTime = 'Sale time is required';
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
    setApiError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      // Compose ISO datetime from date + time
      const dateTimeISO = new Date(`${formData.saleDate}T${formData.saleTime}:00`).toISOString();

      // Prepare payload
      const payload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        productType: formData.productType.trim(),
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        paymentStatus: formData.paymentStatus,
        saleDateTime: dateTimeISO,
      };

      // Replace this URL with your backend endpoint
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save sale');
      }

      // Success callback to parent or reset form
      setFormData(prev => ({
        ...prev,
        customerName: '',
        customerPhone: '',
        productType: '',
        quantity: '',
        unitPrice: '',
        paymentStatus: 'Pending',
        saleDate: new Date().toISOString().slice(0, 10),
        saleTime: new Date().toTimeString().slice(0, 5),
      }));
      if (onSuccess) onSuccess();

    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="sales-form" onSubmit={handleSubmit} noValidate>
      <h2>Record a New Sale</h2>

      <label>
        Customer Name:
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          disabled={submitting}
          required
        />
        {errors.customerName && <small className="error">{errors.customerName}</small>}
      </label>

      <label>
        Customer Phone:
        <input
          type="tel"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          disabled={submitting}
          placeholder="+234..."
          required
        />
        {errors.customerPhone && <small className="error">{errors.customerPhone}</small>}
      </label>

      <label>
        Product Type:
        <input
          type="text"
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          disabled={submitting}
          required
        />
        {errors.productType && <small className="error">{errors.productType}</small>}
      </label>

      <label>
        Quantity (kg):
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          disabled={submitting}
          required
        />
        {errors.quantity && <small className="error">{errors.quantity}</small>}
      </label>

      <label>
        Unit Price (₦):
        <input
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          disabled={submitting}
          required
        />
        {errors.unitPrice && <small className="error">{errors.unitPrice}</small>}
      </label>

      <label>
        Payment Status:
        <select
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
      </label>

      <label>
        Sale Date:
        <input
          type="date"
          name="saleDate"
          value={formData.saleDate}
          onChange={handleChange}
          disabled={submitting}
          required
        />
        {errors.saleDate && <small className="error">{errors.saleDate}</small>}
      </label>

      <label>
        Sale Time:
        <input
          type="time"
          name="saleTime"
          value={formData.saleTime}
          onChange={handleChange}
          disabled={submitting}
          required
        />
        {errors.saleTime && <small className="error">{errors.saleTime}</small>}
      </label>

      {apiError && <p className="error api-error">{apiError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Sale'}
      </button>
    </form>
  );
};

export default SalesForm;
