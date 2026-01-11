
import React, { useState, useEffect } from 'react';
import UserMap from '../components/UserMap';
import { optimizeFleetLoad } from '../services/AiEngine';
import { 
  FaTruck, FaMapMarkedAlt, FaMagic, FaPlus, FaTrash, FaBalanceScale, 
  FaBatteryThreeQuarters, FaThermometerHalf, FaTachometerAlt, FaSatellite 
} from 'react-icons/fa';

const FleetManagerDashboard = () => {
  // --- INITIAL DATA ---
  const MOCK_VEHICLES = [
    { 
      id: 1, name: "Tesla Semi A1", plate: "MH-12-AB-1234", status: "Active", 
      capacity: 95, location: { lat: 18.5204, lng: 73.8567 }, 
      battery: 88, temp: 65, speed: 45 
    },
    { 
      id: 2, name: "Tata Ace X2", plate: "MH-14-XY-9876", status: "Active", 
      capacity: 15, location: { lat: 19.0760, lng: 72.8777 }, 
      battery: 45, temp: 82, speed: 30 
    },
    { 
      id: 3, name: "Eicher Pro Z3", plate: "KA-01-ZZ-5555", status: "Maintenance", 
      capacity: 0, location: { lat: 12.9716, lng: 77.5946 }, 
      battery: 12, temp: 110, speed: 0 
    },
    { 
      id: 4, name: "Ashok Leyland", plate: "TS-09-QQ-1111", status: "Idle", 
      capacity: 0, location: { lat: 17.3850, lng: 78.4867 }, 
      battery: 100, temp: 40, speed: 0 
    }
  ];

  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [currentMapLocation, setCurrentMapLocation] = useState({ lat: 20.5937, lng: 78.9629 });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: '', plate: '', status: 'Active' });

  // --- AUTOMATIC SIMULATION ENGINE (RUNS ALWAYS) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(currentVehicles => 
        currentVehicles.map(v => {
          // Logic: Only 'Active' vehicles move and consume resources
          if (v.status === 'Active') {
            return {
              ...v,
              // Move coordinates slightly (Simulating GPS movement)
              location: {
                lat: v.location.lat + (Math.random() - 0.5) * 0.002,
                lng: v.location.lng + (Math.random() - 0.5) * 0.002
              },
              // Randomize Live Telemetry
              speed: Math.floor(Math.random() * 40) + 30, // 30-70 km/h
              temp: Math.min(130, Math.max(60, v.temp + (Math.random() - 0.5) * 3)), // Fluctuating Temp
              battery: Math.max(0, v.battery - 0.05) // Slow battery drain
            };
          } else {
            // Idle or Maintenance vehicles stay still
            return { 
                ...v, 
                speed: 0,
                temp: Math.max(30, v.temp - 0.5) // Cooling down
            };
          }
        })
      );
    }, 1000); // Updates every second

    return () => clearInterval(interval);
  }, []);

  // --- MODULE 3: LOAD OPTIMIZATION ---
  const handleLoadBalance = () => {
      setIsOptimizing(true);
      setTimeout(() => {
        const optimized = optimizeFleetLoad(vehicles);
        setVehicles(optimized);
        setIsOptimizing(false);
        alert("✅ Fleet Load Redistributed efficiently.");
      }, 800);
  };

  // --- CRUD ACTIONS ---
  const handleSaveVehicle = () => {
      // New vehicles are automatically picked up by the useEffect loop above
      const vehicle = {
          ...newVehicle,
          id: Date.now(),
          capacity: 0,
          location: { lat: 18.5204, lng: 73.8567 }, // Default start
          battery: 100, temp: 60, speed: 0
      };
      setVehicles([...vehicles, vehicle]);
      setShowModal(false);
      setNewVehicle({ name: '', plate: '', status: 'Active' });
  };

  const handleDelete = (id) => {
      setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <FaTruck className="text-blue-600"/> Fleet Command Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real-time Telemetry • Load Optimization • Continuous Simulation</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded shadow-sm border border-gray-200 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600"><FaSatellite className="animate-pulse"/></div>
                <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block">Live Signal</span> 
                    <div className="text-sm font-bold text-gray-800">Connected</div>
                </div>
            </div>
            <div className="bg-white px-4 py-2 rounded shadow-sm border border-gray-200">
                <span className="text-gray-500 text-xs uppercase font-bold">Active Fleet</span> 
                <div className="text-2xl font-bold text-blue-600">{vehicles.filter(v => v.status === 'Active').length}</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* ➤ MODULE 3: LOAD OPTIMIZATION */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                            <FaBalanceScale className="text-indigo-600"/> Load Optimization
                        </h2>
                        <p className="text-xs text-gray-400">AI Capacity Redistribution</p>
                    </div>
                    <button 
                        onClick={handleLoadBalance}
                        disabled={isOptimizing}
                        className={`px-4 py-2 rounded-lg font-bold text-white shadow-md flex items-center gap-2 ${isOptimizing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isOptimizing ? "Optimizing..." : <><FaMagic /> Auto-Balance</>}
                    </button>
                </div>
                {/* Visual Load Bars */}
                <div className="space-y-4">
                    {vehicles.slice(0, 3).map(v => (
                        <div key={v.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-3 text-sm font-medium text-gray-700">{v.name}</div>
                            <div className="col-span-7">
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${v.capacity > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                                        style={{ width: `${v.capacity}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="col-span-2 text-xs font-mono text-gray-500 text-right">{v.capacity}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ➤ MODULE 2 & 4: VEHICLE LIST & TELEMETRY */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-700">Live Telemetry</h3>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-2 shadow-sm">
                        <FaPlus /> Add Vehicle
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Diagnostics (Mod 4)</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vehicles.map(v => (
                                <tr key={v.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{v.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{v.plate}</div>
                                        {/* Speed Indicator */}
                                        <div className={`mt-1 text-xs font-bold flex items-center gap-1 ${v.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                            <FaTachometerAlt /> {v.speed} km/h
                                        </div>
                                    </td>
                                    {/* Module 4: Health Stats */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1" title="Battery Level">
                                                <FaBatteryThreeQuarters className={`${v.battery < 20 ? 'text-red-500' : 'text-green-500'}`} />
                                                <span className="font-mono">{Math.floor(v.battery)}%</span>
                                            </div>
                                            <div className="flex items-center gap-1" title="Engine Temp">
                                                <FaThermometerHalf className={`${v.temp > 100 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                                                <span className="font-mono">{Math.floor(v.temp)}°C</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                            v.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                                            v.status === 'Maintenance' ? 'bg-red-50 text-red-700 border-red-200' : 
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setCurrentMapLocation(v.location)} className="text-blue-500 hover:text-blue-700 mr-3 p-2 hover:bg-blue-100 rounded" title="Locate"><FaMapMarkedAlt /></button>
                                        <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-100 rounded" title="Delete"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: MAP */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px] sticky top-8">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <FaMapMarkedAlt className="text-blue-500" /> Live Tracking
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded animate-pulse">● Live Updates</span>
                </div>
                <div className="flex-1 relative bg-gray-100">
                    <UserMap location={currentMapLocation} />
                </div>
                {/* Selected Vehicle Detail Card */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">GPS Coordinates</div>
                    <div className="font-mono text-sm text-gray-800">
                        Lat: {currentMapLocation.lat.toFixed(5)} <br/>
                        Lng: {currentMapLocation.lng.toFixed(5)}
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* ADD VEHICLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Vehicle</h2>
                <div className="space-y-4">
                    <input className="w-full bg-gray-50 border border-gray-300 p-3 rounded text-gray-800 outline-none focus:border-blue-500" placeholder="Vehicle Name" value={newVehicle.name} onChange={e => setNewVehicle({...newVehicle, name: e.target.value})} />
                    <input className="w-full bg-gray-50 border border-gray-300 p-3 rounded text-gray-800 outline-none focus:border-blue-500" placeholder="License Plate" value={newVehicle.plate} onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})} />
                    <select className="w-full bg-gray-50 border border-gray-300 p-3 rounded text-gray-800 outline-none" value={newVehicle.status} onChange={e => setNewVehicle({...newVehicle, status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Idle">Idle</option>
                    </select>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSaveVehicle} className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow">Save</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default FleetManagerDashboard;   