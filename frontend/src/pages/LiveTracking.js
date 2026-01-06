import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61112.png",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function LiveTracking() {
  const [routePath, setRoutePath] = useState([]);
  const [position, setPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  
  const selectedRoute = useMemo(() => {
    return JSON.parse(localStorage.getItem("selectedRoute") || "null");
  }, []);

  useEffect(() => {
    if (selectedRoute && selectedRoute.start && selectedRoute.dest) {
      fetchOSRMPath(selectedRoute.start, selectedRoute.dest);
    }
  }, [selectedRoute]); 

  const fetchOSRMPath = async (start, dest) => {
    const startStr = `${start.lng},${start.lat}`;
    const destStr = `${dest.lng},${dest.lat}`;
    
    const url = `http://router.project-osrm.org/route/v1/driving/${startStr};${destStr}?overview=full&geometries=geojson`;

    try {
      const response = await axios.get(url);
      if (response.data.routes && response.data.routes.length > 0) {
        const coordinates = response.data.routes[0].geometry.coordinates.map(c => ({
          lat: c[1],
          lng: c[0]
        }));
        
        setRoutePath(coordinates);
        setPosition(coordinates[0]);
        setIsSimulationRunning(true);
      }
    } catch (error) {
      console.error("Error fetching path:", error);
    }
  };

  useEffect(() => {
    if (!isSimulationRunning || routePath.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < routePath.length - 1) {
          const nextIndex = prevIndex + 1;
          setPosition(routePath[nextIndex]);
          return nextIndex;
        } else {
          clearInterval(interval);
          setIsSimulationRunning(false);
          return prevIndex;
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulationRunning, routePath]);

  if (!selectedRoute) return <div style={{padding: 20}}>No route selected. Please plan a trip first.</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
           <h2>Live Vehicle Tracking</h2>
           {position && (
             <div style={{background:'#174769ff', padding:'5px 15px', borderRadius:'20px'}}>
               <strong>Status:</strong> {currentIndex < routePath.length - 1 ? "Moving 🚚" : "Arrived ✅"}
             </div>
           )}
        </div>

        <MapContainer
          center={selectedRoute.start ? [selectedRoute.start.lat, selectedRoute.start.lng] : [0,0]}
          zoom={13}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {position && <MapUpdater center={[position.lat, position.lng]} />}

          {routePath.length > 0 && (
            <Polyline
              positions={routePath.map(p => [p.lat, p.lng])}
              color="#3b82f6"
              weight={6}
              opacity={0.7}
            />
          )}

          {position && (
            <Marker position={[position.lat, position.lng]} icon={vehicleIcon}>
              <Popup>
                <strong>Vehicle #8842</strong><br/>
                Speed: 45 km/h<br/>
                Battery: 78%
              </Popup>
            </Marker>
          )}

          {selectedRoute.start && (
             <Marker position={[selectedRoute.start.lat, selectedRoute.start.lng]}>
               <Popup>Start Point</Popup>
             </Marker>
          )}

          {selectedRoute.dest && (
             <Marker position={[selectedRoute.dest.lat, selectedRoute.dest.lng]}>
               <Popup>Destination</Popup>
             </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}