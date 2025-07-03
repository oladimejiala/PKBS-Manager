const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

// Helper for JSON fetch with error handling
async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'API error');
    }

    return res.status !== 204 ? res.json() : null; // No content status handling
  } catch (error) {
    console.error(`API fetch error: ${error.message}`);
    throw error;
  }
}

// Example API calls:

// Fetch all transactions (for admin dashboard)
export const fetchAllTransactions = () =>
  fetchJSON(`${API_BASE}/transactions`);

// Generate registration token
export const generateToken = () =>
  fetchJSON(`${API_BASE}/auth/generate-token`, { method: 'POST' });

// Fetch sales records
export const fetchSales = () =>
  fetchJSON(`${API_BASE}/sales`);

// Fetch sourcing records
export const fetchSourcing = () =>
  fetchJSON(`${API_BASE}/sourcing`);

// Submit sourcing data
export const submitSourcing = (data) =>
  fetchJSON(`${API_BASE}/sourcing`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Submit sales data
export const submitSales = (data) =>
  fetchJSON(`${API_BASE}/sales`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Export other API calls as needed...

