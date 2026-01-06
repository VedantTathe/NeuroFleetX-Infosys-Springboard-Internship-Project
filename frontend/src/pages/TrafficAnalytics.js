// import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
// import Sidebar from "../components/Sidebar"; // Sidebar included

// export default function TrafficAnalytics() {
//   // Define city center (e.g., Visakhapatnam)
//   const cityCenter = { lat: 17.6868, lng: 83.2185 };

//   // Generate traffic zones around city center
//   const zones = Array.from({ length: 10 }).map(() => ({
//     lat: cityCenter.lat + (Math.random() - 0.5) * 0.1, // small offset
//     lng: cityCenter.lng + (Math.random() - 0.5) * 0.1,
//     density: Math.random(), // 0 = light, 1 = heavy traffic
//     name: `Zone ${Math.floor(Math.random() * 100)}`
//   }));

//   // Function to choose circle color based on density
//   const getColor = (density) => {
//     if (density > 0.7) return "red";
//     if (density > 0.4) return "orange";
//     return "green";
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ flex: 1, padding: "20px" }}>
//         <h2>Traffic Analytics</h2>
//         <p>Red = Heavy traffic | Orange = Moderate | Green = Light</p>

//         <MapContainer
//           center={[cityCenter.lat, cityCenter.lng]}
//           zoom={13}
//           style={{ height: "80vh", width: "100%" }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {zones.map((z, i) => (
//             <Circle
//               key={i}
//               center={[z.lat, z.lng]}
//               radius={500 + z.density * 2000} // size proportional to density
//               pathOptions={{ color: getColor(z.density), fillOpacity: 0.5 }}
//             >
//               <Popup>
//                 {z.name} <br />
//                 Traffic Density: {(z.density * 100).toFixed(0)}%
//               </Popup>
//             </Circle>
//           ))}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Popup, Polyline } from "react-leaflet";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function TrafficAnalytics() {
  const selectedRoute = useMemo(() => {
    return JSON.parse(localStorage.getItem("selectedRoute") || "null");
  }, []);

  const [zones, setZones] = useState([]);
  const [routePath, setRoutePath] = useState([]); 
  
  const defaultCenter = { lat: 17.6868, lng: 83.2185 };
  const center = selectedRoute?.start ? [selectedRoute.start.lat, selectedRoute.start.lng] : [defaultCenter.lat, defaultCenter.lng];

  useEffect(() => {
    if (selectedRoute && selectedRoute.start && selectedRoute.dest) {
      fetchRouteAndGenerateTraffic(selectedRoute.start, selectedRoute.dest);
    } else {
      generateRandomZones(defaultCenter);
    }
    // eslint-disable-next-line 
  }, [selectedRoute]);

  const fetchRouteAndGenerateTraffic = async (start, dest) => {
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

        const newZones = coordinates
          .filter((_, index) => index % 20 === 0) 
          .map((coord, index) => ({
            lat: coord.lat,
            lng: coord.lng,
            density: Math.random(), 
            name: `Route Segment ${index + 1}`
          }));

        setZones(newZones);
      }
    } catch (error) {
      console.error("Error fetching route for traffic:", error);
    }
  };

  const generateRandomZones = (centerPoint) => {
     const randomZones = Array.from({ length: 10 }).map(() => ({
      lat: centerPoint.lat + (Math.random() - 0.5) * 0.1,
      lng: centerPoint.lng + (Math.random() - 0.5) * 0.1,
      density: Math.random(),
      name: `Zone ${Math.floor(Math.random() * 100)}`
    }));
    setZones(randomZones);
  };

  const getColor = (density) => {
    if (density > 0.7) return "red";    // Heavy
    if (density > 0.4) return "orange"; // Moderate
    return "green";                     // Light
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Traffic Analytics</h2>
        <p>Red = Heavy traffic | Orange = Moderate | Green = Light</p>

        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {routePath.length > 0 && (
            <Polyline positions={routePath.map(p => [p.lat, p.lng])} color="gray" weight={3} opacity={0.4} />
          )}

          {zones.map((z, i) => (
            <Circle
              key={i}
              center={[z.lat, z.lng]}
              radius={300} 
              pathOptions={{ 
                color: getColor(z.density), 
                fillColor: getColor(z.density), 
                fillOpacity: 0.6,
                stroke: false 
              }}
            >
              <Popup>
                <strong>{z.name}</strong> <br />
                Traffic Density: {(z.density * 100).toFixed(0)}%
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}