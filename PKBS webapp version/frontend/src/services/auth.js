export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}


export async function verifyFingerprint(fingerprintData) {
  // Example stub: replace with real API call or logic
  try {
    const response = await fetch(`${API_BASE}/auth/verify-fingerprint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint: fingerprintData }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Fingerprint verification failed');
    }
    const data = await response.json();
    return data.verified; // boolean or relevant response
  } catch (error) {
    console.error('Fingerprint verification error:', error.message);
    throw error;
  }
}
