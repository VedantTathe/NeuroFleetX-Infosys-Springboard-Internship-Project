import React, { useState, useEffect, useRef } from 'react';
// We ONLY import L from leaflet. We do NOT use MapContainer to avoid the crash.
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FaSearch, FaRoute, FaClock, FaPlay, 
  FaTrafficLight, FaMapMarkerAlt 
} from 'react-icons/fa';

// Import services
import { getCoordinates, getOSRMRoutes } from '../services/RouteServices';

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Vehicle Icon Definition
const createVehicleIcon = () => L.divIcon({
  className: 'custom-vehicle-icon',
  html: `<div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  iconSize: [16, 16]
});

const RouteOptimizationPage = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('planning'); 
  const [inputs, setInputs] = useState({ source: '', dest: '', stops: '' });
  const [locations, setLocations] = useState({ start: null, end: null });
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef(null);

  // --- MANUAL MAP REFS ( The Fix ) ---
  const mapContainerRef = useRef(null); // The HTML Div
  const mapInstanceRef = useRef(null);  // The Leaflet Map Object
  const layersRef = useRef([]);         // Array to keep track of lines/markers to remove them later
  const vehicleMarkerRef = useRef(null); // Reference to the moving car marker

  // 1. INITIALIZE MAP ON MOUNT
  useEffect(() => {
    if (mapInstanceRef.current) return; // GUARD: If map exists, do not create it again

    // Create Map
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    
    // Add Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup on unmount
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []);

  // 2. DRAW ROUTES & MARKERS WHEN DATA CHANGES
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous layers (lines, markers, circles)
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current = [];

    // --- Draw Start/End Markers ---
    if (locations.start) {
        const startMarker = L.marker([locations.start.lat, locations.start.lng])
            .bindPopup(`Start: ${inputs.source}`)
            .addTo(map);
        layersRef.current.push(startMarker);
    }
    if (locations.end) {
        const endMarker = L.marker([locations.end.lat, locations.end.lng])
            .bindPopup(`End: ${inputs.dest}`)
            .addTo(map);
        layersRef.current.push(endMarker);
    }

    // --- Draw Polylines (Routes) ---
    routes.forEach(route => {
        const isActive = selectedRoute?.id === route.id;
        
        // Only show if comparison tab OR it's the active route
        if (activeTab === 'comparison' || isActive) {
            const polyline = L.polyline(route.coordinates, {
                color: route.color,
                weight: isActive ? 6 : 4,
                opacity: isActive ? 1 : 0.4
            }).addTo(map);
            
            // Add click handler to select route
            polyline.on('click', () => {
                setSelectedRoute(route);
                setActiveTab('view');
            });

            layersRef.current.push(polyline);
        }
    });

    // --- Draw Traffic Circles (Analysis Mode) ---
    if (activeTab === 'analysis' && selectedRoute) {
        const trafficData = getTrafficData();
        trafficData.forEach(zone => {
            const circle = L.circle(zone.pos, {
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.4,
                radius: zone.radius * 100
            }).addTo(map);
            layersRef.current.push(circle);
        });
    }

    // --- Auto Zoom to Fit ---
    if (locations.start && locations.end) {
        const bounds = L.latLngBounds(
            [locations.start.lat, locations.start.lng], 
            [locations.end.lat, locations.end.lng]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [locations, routes, selectedRoute, activeTab]); 

  // --- HANDLERS ---

  const handlePlanRoute = async () => {
    if (!inputs.source || !inputs.dest) return alert("Please enter source and destination");
    
    setLoading(true);
    const startLoc = await getCoordinates(inputs.source);
    const endLoc = await getCoordinates(inputs.dest);

    if (startLoc && endLoc) {
        setLocations({ start: startLoc, end: endLoc });
        const data = await getOSRMRoutes(startLoc, endLoc);
        setRoutes(data);
        setActiveTab('comparison'); 
    } else {
        alert("Locations not found");
    }
    setLoading(false);
  };

  const startSimulation = () => {
    if (!selectedRoute) return;
    setActiveTab('live');
    setIsSimulating(true);
    
    const map = mapInstanceRef.current;
    let index = 0;
    const path = selectedRoute.coordinates;

    // Remove existing vehicle if any
    if (vehicleMarkerRef.current) map.removeLayer(vehicleMarkerRef.current);
    
    // Create new vehicle marker
    const vehicle = L.marker(path[0], { icon: createVehicleIcon() }).addTo(map);
    vehicleMarkerRef.current = vehicle;
    
    if (simulationRef.current) clearInterval(simulationRef.current);

    simulationRef.current = setInterval(() => {
        if (index >= path.length) {
            stopSimulation();
            alert("Destination Reached!");
            return;
        }
        // Update Marker Position directly
        if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng(path[index]);
        }
        index += 3;
    }, 100);
  };

  const stopSimulation = () => {
      clearInterval(simulationRef.current);
      setIsSimulating(false);
      // Remove vehicle marker on stop
      if (vehicleMarkerRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(vehicleMarkerRef.current);
          vehicleMarkerRef.current = null;
      }
  };

  const getTrafficData = () => {
      if (!selectedRoute) return [];
      const path = selectedRoute.coordinates;
      return [
          { pos: path[Math.floor(path.length * 0.2)], color: '#ef4444', radius: 600, level: 'Heavy' },
          { pos: path[Math.floor(path.length * 0.5)], color: '#f97316', radius: 400, level: 'Moderate' },
          { pos: path[Math.floor(path.length * 0.8)], color: '#22c55e', radius: 300, level: 'Clear' }
      ];
  };

  const menuItems = [
    { id: 'planning', label: 'Route Planning', icon: <FaSearch /> },
    { id: 'comparison', label: 'ETA Comparison', icon: <FaClock /> },
    { id: 'view', label: 'Route View', icon: <FaRoute /> },
    { id: 'live', label: 'Live Tracking', icon: <FaPlay /> },
    { id: 'analysis', label: 'Traffic Analysis', icon: <FaTrafficLight /> },
  ];

  return (
    <div className="flex w-full bg-white overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
      
      {/* --- SIDEBAR --- */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-gray-200 flex flex-col bg-gray-50 z-20 shadow-xl h-full">
        <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaRoute className="text-blue-600"/> Route Optimizer
            </h1>
        </div>

        <div className="grid grid-cols-5 gap-1 p-2 bg-white border-b border-gray-200">
            {menuItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                    <div className="text-lg mb-1">{item.icon}</div>
                    <span className="text-center leading-tight">{item.label.split(' ')[0]}</span>
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
            {activeTab === 'planning' && (
                <div className="space-y-5">
                    <h3 className="font-bold text-gray-700">Plan New Shipment</h3>
                    <div className="space-y-3">
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400"/>
                            <input 
                                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Source City"
                                value={inputs.source}
                                onChange={e => setInputs({...inputs, source: e.target.value})}
                            />
                        </div>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-3.5 text-blue-500"/>
                            <input 
                                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Destination City"
                                value={inputs.dest}
                                onChange={e => setInputs({...inputs, dest: e.target.value})}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handlePlanRoute}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? 'Processing...' : 'Calculate Routes'}
                    </button>
                </div>
            )}

            {activeTab === 'comparison' && (
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700">Select Route</h3>
                    {routes.map((route) => (
                        <div 
                            key={route.id}
                            onClick={() => { setSelectedRoute(route); setActiveTab('view'); }}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md bg-white ${selectedRoute?.id === route.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-gray-800">{route.type}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold`} style={{background: route.color}}>{route.tag}</span>
                                </div>
                                <div className="font-bold text-lg">₹{route.cost}</div>
                            </div>
                            <div className="text-sm text-gray-600 flex gap-4">
                                <span>{route.duration} mins</span>
                                <span>{route.distance} km</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'view' && selectedRoute && (
                <div className="space-y-6">
                     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-lg">{selectedRoute.type}</h3>
                        <p className="text-gray-500 text-sm">Path from {inputs.source} to {inputs.dest}</p>
                     </div>
                     <button onClick={startSimulation} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow gap-2 flex justify-center items-center">
                        <FaPlay /> Start Live Tracking
                     </button>
                </div>
            )}

            {activeTab === 'live' && (
                <div className="text-center space-y-4">
                    {isSimulating ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-green-800">Vehicle in Transit</h2>
                            <p className="text-sm text-green-600 mb-4">Real-time GPS active</p>
                            <button onClick={stopSimulation} className="mt-4 text-red-500 text-sm font-bold underline">Stop Simulation</button>
                        </div>
                    ) : (
                        <div className="text-gray-400 py-10">Select a route first.</div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* --- MAP AREA (MANUAL) --- */}
      <div className="flex-1 relative h-full w-full bg-gray-100">
        {/* WE USE A STANDARD DIV. NO REACT-LEAFLET COMPONENT. NO CRASH. */}
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
        
      </div>
    </div>
  );
};

export default RouteOptimizationPage;