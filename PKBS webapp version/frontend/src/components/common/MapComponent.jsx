import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const MapComponent = ({ transactions = [] }) => {
  const [mapCenter, setMapCenter] = useState([6.465422, 3.406448]); // Lagos default
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (transactions.length > 0 && transactions[0].location?.coordinates?.length === 2) {
      const [lng, lat] = transactions[0].location.coordinates;
      setMapCenter([lat, lng]);
      setZoom(12);
    }
  }, [transactions]);

  return (
    <div className="map-container">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {transactions.map((transaction, index) => {
          const loc = transaction.location?.coordinates;
          if (!loc || loc.length !== 2) return null;

          const [lng, lat] = loc;

          return (
            <Marker key={index} position={[lat, lng]}>
              <Popup>
                <div>
                  <h4>{transaction.type?.toUpperCase() || 'TRANSACTION'}</h4>
                  <p><strong>Date:</strong> {new Date(transaction.timestamp || transaction.createdAt).toLocaleString()}</p>
                  <p><strong>Staff:</strong> {transaction.staffId?.name || 'N/A'}</p>
                  {transaction.type === 'sourcing' && (
                    <p><strong>Supplier:</strong> {transaction.supplierName || 'N/A'}</p>
                  )}
                  {transaction.quantity && (
                    <p><strong>Quantity:</strong> {transaction.quantity} kg</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
