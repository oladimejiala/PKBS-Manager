const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

export async function fetchUserTransactions(userId) {
  const response = await fetch(`${API_BASE}/transactions/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
}

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed`);
    }
    return response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed`);
    }
    return response.json();
  },
};

export async function fetchFactories() {
  const response = await fetch(`${API_BASE}/factories`);
  if (!response.ok) {
    throw new Error('Failed to fetch factories');
  }
  return response.json();
}

export async function fetchLogistics() {
  const response = await fetch(`${API_BASE}/logistics`);
  if (!response.ok) {
    throw new Error('Failed to fetch logistics');
  }
  return response.json();
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchOrders() {
  const response = await fetch(`${API_BASE}/orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export async function fetchUsers() {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function fetchUserById(userId) {
  const response = await fetch(`${API_BASE}/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return response.json();
}

export async function updateOrder(orderId, orderData) {
  const response = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to update order');
  }
  return response.json();
} 

export async function deleteOrder(orderId) {
  const response = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete order');
  }
  return response.json();
}

export async function createLogistics(logisticsData) {
  const response = await fetch(`${API_BASE}/logistics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logisticsData),
  });
  if (!response.ok) {
    throw new Error('Failed to create logistics');
  }
  return response.json();
}

export async function updateLogistics(logisticsId, logisticsData) {
  const response = await fetch(`${API_BASE}/logistics/${logisticsId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logisticsData),
  });
  if (!response.ok) {
    throw new Error('Failed to update logistics');
  }
  return response.json();
}

// services/api.js

export async function fetchSales() {
  const response = await fetch('/api/sales'); // 🔁 Adjust endpoint if needed
  if (!response.ok) {
    throw new Error('Failed to fetch sales data');
  }
  return response.json();
}
export async function fetchInventory() {
  const response = await fetch('/api/inventory'); // 🔁 Adjust endpoint if needed
  if (!response.ok) {
    throw new Error('Failed to fetch inventory data');
  }
  return response.json();
} 

export async function fetchReports() {
  const response = await fetch('/api/reports'); // 🔁 Adjust endpoint if needed
  if (!response.ok) {
    throw new Error('Failed to fetch reports data');
  }
  return response.json();
}

export async function fetchNotifications() {
  const response = await fetch('/api/notifications'); // 🔁 Adjust endpoint if needed
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

export async function fetchSettings() {
  const response = await fetch('/api/settings'); // 🔁 Adjust endpoint if needed
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}

// services/api.js

export async function fetchSourcing() {
  const response = await fetch(`${API_BASE}/sourcing`);
  if (!response.ok) {
    throw new Error('Failed to fetch sourcing data');
  }
  return response.json();
}


