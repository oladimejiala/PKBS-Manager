export const api = {
  get: (endpoint) => fetch(endpoint),
  post: (endpoint, data) => fetch(endpoint, { 
    method: 'POST',
    body: JSON.stringify(data)
  })
};
