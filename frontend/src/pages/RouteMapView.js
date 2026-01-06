import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function RouteMapView() {
  const [routePath, setRoutePath] = useState([]);
  const [routeDetails, setRouteDetails] = useState(null);

  const routeData = useMemo(() => {
    return JSON.parse(localStorage.getItem("selectedRoute") || "null");
  }, []);

  useEffect(() => {
    if (routeData && routeData.start && routeData.dest) {
      fetchOSRMPath(routeData.start, routeData.dest);
    }
  }, [routeData]); 

  const fetchOSRMPath = async (start, dest) => {
    const startStr = `${start.lng},${start.lat}`;
    const destStr = `${dest.lng},${dest.lat}`;
    
    const url = `http://router.project-osrm.org/route/v1/driving/${startStr};${destStr}?overview=full&geometries=geojson`;

    try {
      const response = await axios.get(url);
      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        setRoutePath(coordinates);
        setRouteDetails({
          distance: (route.distance / 1000).toFixed(2),
          duration: (route.duration / 60).toFixed(0) 
        });
      }
    } catch (error) {
      console.error("Error fetching OSRM path:", error);
    }
  };

  if (!routeData) return <h3>No route selected</h3>;

  const center = [routeData.start.lat, routeData.start.lng];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Route Map</h2>
        
        {routeDetails && (
          <div style={{ marginBottom: '10px', padding: '10px', background: '#3634ceff', borderRadius: '5px' }}>
             <strong>Actual Road Distance:</strong> {routeDetails.distance} km | 
             <strong> Est. Time:</strong> {routeDetails.duration} mins
          </div>
        )}

        <MapContainer center={center} zoom={13} style={{ height: "80vh", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker position={[routeData.start.lat, routeData.start.lng]}>
             <Popup>Start</Popup>
          </Marker>

          <Marker position={[routeData.dest.lat, routeData.dest.lng]}>
             <Popup>Destination</Popup>
          </Marker>

          {routePath.length > 0 && (
            <Polyline positions={routePath} color="blue" weight={5} opacity={0.7} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}