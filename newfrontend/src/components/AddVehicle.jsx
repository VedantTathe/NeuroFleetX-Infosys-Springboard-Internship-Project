import React, { useState, useEffect } from 'react';
import { 
  FaCar, FaSatellite, FaHeartbeat, FaLaptopCode, FaSave, FaTimes, 
  FaPlay, FaStop, FaMicrochip, FaWifi 
} from 'react-icons/fa';

const AddVehicle = ({ onSave, onCancel, isEmbedded = false }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSimulating, setIsSimulating] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  // Initial Form State
  const [formData, setFormData] = useState({
    make: '', model: '', type: 'SEDAN', licensePlate: '', 
    passengerCapacity: 4, year: 2023, color: '', basePricePerKm: 2.5,
    isAvailable: true
  });

  // --- MODULE 2: SIMULATION PREVIEW ---
  // This visualizes the data stream before you actually "Add" the vehicle
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        const speed = Math.floor(Math.random() * 80) + 10;
        const temp = Math.floor(Math.random() * 15) + 85;
        const log = `[${new Date().toLocaleTimeString()}] SPD:${speed}km/h | ENG:${temp}°C | LAT:${(17.3850 + Math.random()*0.001).toFixed(4)}`;
        setTelemetryLogs(prev => [log, ...prev].slice(0, 6)); // Keep last 6 logs
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the final data back to the Dashboard
    onSave(formData); 
  };

  // Helper for Tabs
  const TabButton = ({ id, icon, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === id 
          ? 'border-blue-600 text-blue-600 bg-blue-50' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon} <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className={`bg-white w-full flex flex-col ${isEmbedded ? 'h-full' : 'rounded-xl shadow-lg border border-gray-200'}`}>
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Add New Vehicle</h2>
          <p className="text-xs text-gray-500">Configure Hardware & Telemetry</p>
        </div>
        {/* Only show X if not embedded, otherwise parent handles close */}
        {!isEmbedded && (
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        )}
      </div>

      {/* 2. TABS */}
      <div className="flex overflow-x-auto border-b border-gray-200 px-8 bg-gray-50/50">
        <TabButton id="basic" icon={<FaCar />} label="Details" />
        <TabButton id="gps" icon={<FaSatellite />} label="GPS Config" />
        <TabButton id="health" icon={<FaHeartbeat />} label="Thresholds" />
        <TabButton id="telemetry" icon={<FaLaptopCode />} label="Simulation" />
      </div>

      {/* 3. FORM BODY */}
      <div className="p-8 overflow-y-auto flex-1">
        <form id="vehicleForm" onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- TAB 1: BASIC DETAILS --- */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Make</label>
                <input type="text" name="make" value={formData.make} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Tesla" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Model Y" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">License Plate</label>
                <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="XX-00-YY-0000" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Passenger Capacity</label>
                <input type="number" name="passengerCapacity" value={formData.passengerCapacity} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="4" min="1" max="8" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2023" min="2000" max="2024" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="White" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Base Price per KM</label>
                <input type="number" step="0.1" name="basePricePerKm" value={formData.basePricePerKm} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2.5" min="0.1" />
              </div>
            </div>
          )}

          {/* --- TAB 2: GPS CONFIG (Module 2) --- */}
          {activeTab === 'gps' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r flex items-start gap-3">
                <FaSatellite className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Hardware Configuration</h4>
                  <p className="text-xs text-blue-700">Enter the IMEI of the installed tracker to enable real-time map updates.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GPS Device IMEI</label>
                  <input type="text" name="gpsDeviceId" value={formData.gpsDeviceId} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded font-mono text-sm" placeholder="8649102..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Protocol</label>
                  <select name="protocol" value={formData.protocol} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded">
                    <option value="MQTT">MQTT (Fastest)</option>
                    <option value="HTTP">HTTP/REST</option>
                    <option value="TCP">Raw TCP</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 3: HEALTH THRESHOLDS (Module 4) --- */}
          {activeTab === 'health' && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-gray-500">Set safety limits. If vehicle data exceeds these, a <span className="text-red-500 font-bold">Critical Alert</span> will be triggered.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">Max Engine Temp</label>
                    <span className="text-sm font-mono text-red-600">{formData.maxEngineTemp}°C</span>
                  </div>
                  <input type="range" name="maxEngineTemp" min="90" max="130" value={formData.maxEngineTemp} onChange={handleInputChange} className="w-full accent-red-500" />
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">Min Tire Pressure</label>
                    <span className="text-sm font-mono text-blue-600">{formData.minTirePressure} PSI</span>
                  </div>
                  <input type="range" name="minTirePressure" min="20" max="40" value={formData.minTirePressure} onChange={handleInputChange} className="w-full accent-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 4: SIMULATION PREVIEW (Module 2) --- */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg shadow-inner font-mono text-xs">
                <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
                  <span className="flex items-center gap-2 font-bold"><FaMicrochip /> ECU STREAM</span>
                  <span className={`flex items-center gap-1 ${isSimulating ? "text-green-400" : "text-gray-500"}`}>
                    <FaWifi className={isSimulating ? "animate-pulse" : ""} /> {isSimulating ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="h-32 overflow-y-auto space-y-1 mb-3 text-opacity-80">
                  {telemetryLogs.length === 0 ? <span className="text-gray-600 italic">No data stream...</span> : telemetryLogs.map((log, i) => (
                    <div key={i} className="border-l-2 border-green-600 pl-2 opacity-90">{log}</div>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`w-full py-2 rounded font-bold transition-all ${isSimulating ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-black'}`}
                >
                  {isSimulating ? <><FaStop className="inline mr-2"/> STOP TEST</> : <><FaPlay className="inline mr-2"/> TEST CONNECTION</>}
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                * Enabling this will start the vehicle in "Simulation Mode" on the map immediately after saving.
              </p>
            </div>
          )}
        </form>
      </div>

      {/* 4. FOOTER */}
      <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button 
          type="button"
          onClick={onCancel} 
          className="px-5 py-2 rounded border border-gray-300 text-gray-600 text-sm font-medium hover:bg-white transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          className="px-5 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md flex items-center gap-2"
        >
          <FaSave /> Save Vehicle
        </button>
      </div>

    </div>
  );
};

export default AddVehicle;