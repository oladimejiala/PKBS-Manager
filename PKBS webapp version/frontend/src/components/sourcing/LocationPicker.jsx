import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './LocationPicker.css'; // assuming you meant this

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'your-mapbox-token';

const LocationPicker = ({ onLocationSelect, initialCoordinates }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [coordinates, setCoordinates] = useState(
    initialCoordinates || { longitude: 3.4064, latitude: 6.4654 } // Lagos default
  );

  useEffect(() => {
    if (!mapboxgl.accessToken || mapboxgl.accessToken === 'your-mapbox-token') {
      console.warn('Mapbox access token is missing or invalid.');
    }

    if (map.current) return; // Prevent reinitialization

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 14
    });

    // Add marker
    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([coordinates.longitude, coordinates.latitude])
      .addTo(map.current);

    // Drag handler
    marker.current.on('dragend', () => {
      const { lng, lat } = marker.current.getLngLat();
      setCoordinates({ longitude: lng, latitude: lat });
      onLocationSelect({ longitude: lng, latitude: lat });
    });

    // Map click handler
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setCoordinates({ longitude: lng, latitude: lat });
      marker.current.setLngLat([lng, lat]);
      onLocationSelect({ longitude: lng, latitude: lat });
    });

    return () => map.current?.remove();
  }, [coordinates, onLocationSelect]);

  return (
    <div className="location-picker">
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: '400px', width: '100%' }}
      />
      <div className="coordinates-display">
        <span><strong>Longitude:</strong> {coordinates.longitude.toFixed(6)}</span>
        <span><strong>Latitude:</strong> {coordinates.latitude.toFixed(6)}</span>
      </div>
    </div>
  );
};

export default LocationPicker;
