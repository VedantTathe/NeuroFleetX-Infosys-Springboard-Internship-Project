import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/services';
import { 
  FaTruck, FaUsers, FaRoute, FaCheckCircle, FaDollarSign, FaChartLine,
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaEye,
  FaClock, FaMapMarkerAlt, FaGasPump, FaWrench
} from 'react-icons/fa';

const FleetManagerDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMetrics();
    fetchVehicles();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await dashboardService.getFleetManagerMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      // Mock vehicle data
      const mockVehicles = [
        {
          id: 1,
          name: 'Truck 001',
          type: 'Truck',
          status: 'active',
          driver: 'John Doe',
          location: 'Downtown',
          fuel: 75,
          battery: null,
          lastMaintenance: '2024-12-01',
          nextMaintenance: '2025-01-15',
          revenue: 2450
        },
        {
          id: 2,
          name: 'Van 002',
          type: 'Van',
          status: 'idle',
          driver: 'Jane Smith',
          location: 'Airport',
          fuel: 45,
          battery: null,
          lastMaintenance: '2024-11-15',
          nextMaintenance: '2025-01-01',
          revenue: 1890
        },
        {
          id: 3,
          name: 'EV Car 003',
          type: 'Car',
          status: 'maintenance',
          driver: 'Mike Johnson',
          location: 'Service Center',
          fuel: null,
          battery: 20,
          lastMaintenance: '2024-12-20',
          nextMaintenance: '2025-01-05',
          revenue: 1230
        },
        {
          id: 4,
          name: 'Bike 004',
          type: 'Bike',
          status: 'active',
          driver: 'Sarah Wilson',
          location: 'University',
          fuel: null,
          battery: 85,
          lastMaintenance: '2024-11-30',
          nextMaintenance: '2025-01-10',
          revenue: 890
        }
      ];
      setVehicles(mockVehicles);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock metrics data
  const mockMetrics = {
    activeVehicles: 28,
    totalFleetSize: 35,
    activeTrips: 12,
    completedTrips: 156,
    activeDrivers: 28,
    weeklyRevenue: 12450,
    utilizationRate: 80,
    fuelEfficiency: 8.5,
    maintenanceDue: 3
  };

  const displayMetrics = metrics || mockMetrics;

  const MetricCard = ({ icon, title, value, subtitle, color = 'blue', trend }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-10`}>
              <div className={`${colorClasses[color]} text-white text-xl`}>
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          {trend && (
            <div className={`text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
      </div>
    );
  };

  const VehicleCard = ({ vehicle }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'idle': return 'bg-yellow-100 text-yellow-800';
        case 'maintenance': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getFuelColor = (percentage) => {
      if (percentage > 50) return 'bg-green-500';
      if (percentage > 25) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
            <p className="text-sm text-gray-600">{vehicle.type}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
            {vehicle.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Driver:</span>
            <span className="font-medium">{vehicle.driver}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {vehicle.location}
            </span>
          </div>

          {vehicle.fuel !== null && (
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Fuel:</span>
                <span className="font-medium">{vehicle.fuel}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getFuelColor(vehicle.fuel)}`}
                  style={{ width: `${vehicle.fuel}%` }}
                ></div>
              </div>
            </div>
          )}

          {vehicle.battery !== null && (
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Battery:</span>
                <span className="font-medium">{vehicle.battery}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getFuelColor(vehicle.battery)}`}
                  style={{ width: `${vehicle.battery}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Maintenance:</span>
            <span className="font-medium">{vehicle.nextMaintenance}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Revenue:</span>
            <span className="font-medium text-green-600">${vehicle.revenue}</span>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
            <FaEye className="inline mr-1" />
            View
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
            <FaEdit className="inline mr-1" />
            Edit
          </button>
        </div>
      </div>
    );
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fleet Manager Dashboard</h1>
              <p className="text-gray-600">Manage your vehicles and operations</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <FaPlus className="inline mr-2" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={<FaTruck />}
            title="Active Vehicles"
            value={displayMetrics.activeVehicles}
            subtitle={`of ${displayMetrics.totalFleetSize} total`}
            color="green"
            trend={5.2}
          />
          <MetricCard
            icon={<FaRoute />}
            title="Active Trips"
            value={displayMetrics.activeTrips}
            subtitle="Currently in progress"
            color="blue"
          />
          <MetricCard
            icon={<FaCheckCircle />}
            title="Completed Trips"
            value={displayMetrics.completedTrips}
            subtitle="This month"
            color="purple"
            trend={12.8}
          />
          <MetricCard
            icon={<FaUsers />}
            title="Active Drivers"
            value={displayMetrics.activeDrivers}
            subtitle="Currently working"
            color="orange"
          />
          <MetricCard
            icon={<FaDollarSign />}
            title="Weekly Revenue"
            value={`$${displayMetrics.weeklyRevenue.toLocaleString()}`}
            subtitle="Last 7 days"
            color="green"
            trend={8.5}
          />
          <MetricCard
            icon={<FaWrench />}
            title="Maintenance Due"
            value={displayMetrics.maintenanceDue}
            subtitle="Vehicles need service"
            color="red"
          />
        </div>

        {/* Vehicles Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Vehicle Fleet</h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="maintenance">Maintenance</option>
              </select>

              {/* Export Button */}
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                <FaDownload className="inline mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredVehicles || []).map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {(filteredVehicles || []).length === 0 && (
            <div className="text-center py-12">
              <FaTruck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetManagerDashboard;
