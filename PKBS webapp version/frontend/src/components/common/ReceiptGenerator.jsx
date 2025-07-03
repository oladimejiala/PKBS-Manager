import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';
import logo from '../assets/pkbs-logo.png';
import './ReceiptGenerator.css';

const ReceiptGenerator = ({ transaction, type }) => {
  const [receiptData, setReceiptData] = useState(null);
  const receiptRef = useRef();

  useEffect(() => {
    if (transaction) {
      const details = getTransactionDetails(transaction, type);
      const items = getTransactionItems(transaction, type);
      const total = calculateTotal(transaction, type);

      setReceiptData({
        id: transaction._id,
        date: format(new Date(transaction.createdAt), 'PPPppp'),
        type: type.toUpperCase(),
        staff: transaction.staffId?.name || 'N/A',
        details,
        items,
        total,
        location: transaction.location
          ? `Lat: ${transaction.location.coordinates[1]}, Long: ${transaction.location.coordinates[0]}`
          : 'N/A'
      });
    }
  }, [transaction, type]);

  const getTransactionDetails = (transaction, type) => {
    switch (type) {
      case 'sourcing':
        return {
          'Supplier Name': transaction.supplierName || 'N/A',
          'Supplier Phone': transaction.supplierPhone || 'N/A',
          'Payment Method': 'Bank Transfer'
        };
      case 'logistics':
        return {
          'Driver Name': transaction.driverName || 'N/A',
          'Vehicle Number': transaction.vehicleNumber || 'N/A',
          'Border Crossing': transaction.borderCrossing || 'N/A'
        };
      case 'factory':
        return {
          'Processing Time': `${transaction.processingTime} hours`,
          'PKO Extracted': `${transaction.pkoExtracted} kg`,
          'PKC Extracted': `${transaction.pkcExtracted} kg`
        };
      case 'sales':
        return {
          'Customer Name': transaction.customerName || 'N/A',
          'Customer Phone': transaction.customerPhone || 'N/A',
          'Payment Status': transaction.paymentStatus || 'N/A'
        };
      default:
        return {};
    }
  };

  const getTransactionItems = (transaction, type) => {
    switch (type) {
      case 'sourcing':
        return [{
          name: 'Palm Kernels',
          quantity: transaction.quantity,
          unit: transaction.unit || 'kg',
          price: transaction.price,
          total: transaction.quantity * transaction.price
        }];
      case 'sales':
        return [{
          name: transaction.productType,
          quantity: transaction.quantity,
          unit: 'kg',
          price: transaction.unitPrice,
          total: transaction.totalAmount
        }];
      default:
        return [];
    }
  };

  const calculateTotal = (transaction, type) => {
    if (type === 'sourcing') return transaction.quantity * transaction.price;
    if (type === 'sales') return transaction.totalAmount;
    if (type === 'logistics') return transaction.logisticsCost;
    if (type === 'factory') return transaction.processingCost;
    return 0;
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    pageStyle: `
      @page { size: auto; margin: 5mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `
  });

  const sendEmailReceipt = async () => {
    try {
      // TODO: Implement email logic
      console.log('Email receipt sent for transaction:', transaction._id);
    } catch (error) {
      console.error('Failed to send email receipt:', error);
    }
  };

  if (!receiptData) return <div>Loading receipt data...</div>;

  return (
    <div className="receipt-generator">
      <div className="receipt-actions">
        <button onClick={handlePrint}>Print Receipt</button>
        <button onClick={sendEmailReceipt}>Email Receipt</button>
      </div>

      <div className="receipt-paper" ref={receiptRef}>
        <div className="receipt-header">
          <img src={logo} alt="PKBS Logo" className="receipt-logo" />
          <h2>PALM KERNEL BUSINESS SYSTEM</h2>
          <p>Transaction Receipt</p>
        </div>

        <div className="receipt-meta">
          <div>
            <strong>Receipt #:</strong> PKBS-{receiptData.id.slice(-6).toUpperCase()}
          </div>
          <div>
            <strong>Date:</strong> {receiptData.date}
          </div>
          <div>
            <strong>Type:</strong> {receiptData.type}
          </div>
          <div>
            <strong>Handled By:</strong> {receiptData.staff}
          </div>
        </div>

        <div className="receipt-details">
          <h3>Transaction Details</h3>
          {Object.entries(receiptData.details).map(([key, value]) => (
            <div key={key} className="detail-row">
              <span className="detail-label">{key}:</span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>

        {receiptData.items.length > 0 && (
          <div className="receipt-items">
            <h3>Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {receiptData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>₦{item.price.toLocaleString()}</td>
                    <td>₦{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="receipt-total">
          <strong>TOTAL AMOUNT:</strong>
          <span>₦{receiptData.total.toLocaleString()}</span>
        </div>

        <div className="receipt-footer">
          <p>Location: {receiptData.location}</p>
          <p>Thank you for your business!</p>
          <div className="signature">
            <p>_________________________</p>
            <p>Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptGenerator;
