import React, { useState } from 'react';
import { 
  FaWrench, FaExclamationTriangle, FaCheckCircle, FaThermometerHalf, 
  FaBatteryThreeQuarters, FaOilCan, FaClock, FaSearch, FaFilter
} from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Maintenance = () => {
  // --- MOCK DATA: VEHICLE HEALTH ---
  const [vehicles] = useState([
    { 
      id: 1, name: "Tesla Semi A1", plate: "MH-12-AB-1234", status: "Healthy", 
      healthScore: 92, nextService: "2026-03-15", 
      battery: 88, engineTemp: 65, oilLevel: 90, tirePressure: 32 
    },
    { 
      id: 2, name: "Tata Ace X2", plate: "MH-14-XY-9876", status: "Warning", 
      healthScore: 75, nextService: "2026-01-20", 
      battery: 45, engineTemp: 92, oilLevel: 60, tirePressure: 28 
    },
    { 
      id: 3, name: "Eicher Pro Z3", plate: "KA-01-ZZ-5555", status: "Critical", 
      healthScore: 45, nextService: "OVERDUE", 
      battery: 12, engineTemp: 115, oilLevel: 20, tirePressure: 25 
    },
    { 
      id: 4, name: "Ashok Leyland", plate: "TS-09-QQ-1111", status: "Healthy", 
      healthScore: 98, nextService: "2026-06-10", 
      battery: 100, engineTemp: 55, oilLevel: 95, tirePressure: 35 
    },
    { 
      id: 5, name: "Mahindra Bolero", plate: "AP-22-MM-9090", status: "Warning", 
      healthScore: 70, nextService: "2026-02-05", 
      battery: 78, engineTemp: 88, oilLevel: 50, tirePressure: 29 
    }
  ]);

  // --- MOCK DATA: ALERTS ---
  const [alerts, setAlerts] = useState([
    { id: 101, vehicle: "Eicher Pro Z3", severity: "Critical", issue: "Engine Overheating (115°C)", date: "2026-01-11", status: "Open" },
    { id: 102, vehicle: "Tata Ace X2", severity: "Medium", issue: "Low Tire Pressure (Front-Left)", date: "2026-01-10", status: "Open" },
    { id: 103, vehicle: "Mahindra Bolero", severity: "Low", issue: "Routine Oil Change Due", date: "2026-01-08", status: "Open" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // --- ACTIONS ---
  const handleResolveAlert = (id) => {
    if(window.confirm("Mark this alert as resolved?")) {
      setAlerts(alerts.filter(a => a.id !== id));
      alert("✅ Maintenance Ticket Closed");
    }
  };

  // --- ANALYTICS CALCS ---
  const stats = {
    healthy: vehicles.filter(v => v.status === 'Healthy').length,
    warning: vehicles.filter(v => v.status === 'Warning').length,
    critical: vehicles.filter(v => v.status === 'Critical').length,
    total: vehicles.length
  };

  const chartData = [
    { name: 'Healthy', value: stats.healthy, color: '#10b981' },
    { name: 'Warning', value: stats.warning, color: '#f59e0b' },
    { name: 'Critical', value: stats.critical, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <FaWrench className="text-orange-600"/> Maintenance & Health Hub
          </h1>
          <p className="text-gray-500 text-sm mt-1">Module 4: Predictive Analytics & Diagnostics</p>
        </div>
        
        {/* TOP STATS */}
        <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-xs text-gray-500 uppercase font-bold">Health Score</div>
                <div className="text-2xl font-bold text-green-600">85%</div>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-xs text-gray-500 uppercase font-bold">Open Alerts</div>
                <div className="text-2xl font-bold text-red-500">{alerts.length}</div>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-xs text-gray-500 uppercase font-bold">Due Service</div>
                <div className="text-2xl font-bold text-orange-500">{vehicles.filter(v => v.status !== 'Healthy').length}</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: ALERTS & CHARTS */}
        <div className="lg:col-span-1 space-y-8">
            
            {/* 1. ANALYTICS CHART */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4">Fleet Health Distribution</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={chartData} 
                                cx="50%" cy="50%" 
                                innerRadius={60} outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. CRITICAL ALERTS LIST */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
                    <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <FaExclamationTriangle /> Critical Alerts
                    </h3>
                    <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-1 rounded-full">{alerts.length} New</span>
                </div>
                <div className="divide-y divide-gray-100">
                    {alerts.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">✅ All systems normal</div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-800 text-sm">{alert.vehicle}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                                        alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
                                        alert.severity === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                    }`}>{alert.severity}</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{alert.issue}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><FaClock/> {alert.date}</span>
                                    <button 
                                        onClick={() => handleResolveAlert(alert.id)}
                                        className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all font-medium"
                                    >
                                        Resolve
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>

        {/* RIGHT COL: VEHICLE HEALTH GRID */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* FILTER BAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search vehicle by name or plate..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium">
                    <FaFilter /> Filter
                </button>
            </div>

            {/* VEHICLE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles
                  .filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.plate.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(v => (
                    <div key={v.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{v.name}</h3>
                                <p className="text-xs text-gray-500 font-mono">{v.plate}</p>
                            </div>
                            <div className={`text-center px-3 py-1 rounded-lg ${
                                v.status === 'Healthy' ? 'bg-green-50 text-green-700' :
                                v.status === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                            }`}>
                                <div className="text-xl font-bold">{v.healthScore}%</div>
                                <div className="text-[10px] uppercase font-bold">Score</div>
                            </div>
                        </div>

                        {/* Diagnostics Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaBatteryThreeQuarters/> Battery</div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                                    <div className={`h-full rounded-full ${v.battery < 30 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${v.battery}%`}}></div>
                                </div>
                                <div className="text-xs font-bold text-gray-700">{v.battery}%</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaThermometerHalf/> Engine</div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                                    <div className={`h-full rounded-full ${v.engineTemp > 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${v.engineTemp}%`}}></div>
                                </div>
                                <div className="text-xs font-bold text-gray-700">{v.engineTemp}°C</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaOilCan/> Oil Level</div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                                    <div className={`h-full rounded-full ${v.oilLevel < 30 ? 'bg-red-500' : 'bg-orange-500'}`} style={{width: `${v.oilLevel}%`}}></div>
                                </div>
                                <div className="text-xs font-bold text-gray-700">{v.oilLevel}%</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaCheckCircle/> Tires</div>
                                <div className="text-xs font-bold text-gray-700 mt-2">{v.tirePressure} PSI</div>
                            </div>
                        </div>

                        {/* Predictive Footer */}
                        <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                            <span className="text-gray-500">Predicted Service:</span>
                            <span className={`font-bold font-mono ${v.nextService === 'OVERDUE' ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                                {v.nextService}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Maintenance;