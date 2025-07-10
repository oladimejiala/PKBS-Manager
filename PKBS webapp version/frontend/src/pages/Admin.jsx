import React, { useState } from 'react';
import ReceiptGenerator from 'components/common/ReceiptGenerator'; // Adjust path as needed

const columns = [
  {
    name: 'Date',
    selector: row => new Date(row.timestamp).toLocaleString(),
    sortable: true,
  },
  {
    name: 'Type',
    selector: row => row.type || '-',
    sortable: true,
  },
  {
    name: 'Staff',
    selector: row => row.staffId?.name || '-',
    sortable: true,
  },
  {
    name: 'Quantity (kg)',
    selector: row => row.quantity ?? '-',
    sortable: true,
  },
  {
    name: 'Amount (₦)',
    selector: row => (row.price ? row.price.toLocaleString() : '-'),
    sortable: true,
  },
  {
    name: 'Status',
    selector: row => row.status || '-',
    sortable: true,
  },
  {
    name: 'Actions',
    cell: row => <ReceiptGenerator transaction={row} />,
  },
];

const Admin = () => {
  const [newToken, setNewToken] = useState(null); // Placeholder for actual logic

  return (
    <div>
      {/* Your table would go here, using `columns` */}
      {/* e.g., <DataTable columns={columns} data={data} /> */}

      {newToken && (
        <div
          className="token-display"
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#f4f4f4',
            padding: '10px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <h3>New Registration Token:</h3>
          <pre>{newToken}</pre>
          <p>Share this with new staff for registration</p>
        </div>
      )}
    </div>
  );
};

export default Admin;
