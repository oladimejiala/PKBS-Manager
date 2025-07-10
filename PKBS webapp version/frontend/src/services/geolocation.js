export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      options
    );
  });
}

// Usage example (outside this file):
// try {
//   const position = await getCurrentPosition({ enableHighAccuracy: true });
//   console.log(position.coords.latitude, position.coords.longitude);
// } catch (err) {
//   console.error('Geolocation error:', err.message);
// }
