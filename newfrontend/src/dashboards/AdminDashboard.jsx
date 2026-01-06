import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/services';
import { ROLES } from '../utils/authUtils';
import { 
  FaUsers, FaTruck, FaCalendarCheck, FaUserCheck, FaRoute, FaDollarSign,
  FaChartLine, FaChartBar, FaChartPie, FaExclamationTriangle, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaMinus
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin metrics');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockMetrics = {
    totalUsers: 1247,
    totalFleets: 89,
    totalBookings: 3542,
    activeUsers: 892,
    completedTrips: 7845,
    totalRevenue: 456789.50,
    userGrowth: 12.5,
    fleetGrowth: 8.3,
    bookingGrowth: 15.7,
    revenueGrowth: 22.1,
    recentActivity: [
      { id: 1, type: 'user', action: 'New user registered', user: 'John Doe', time: '2 mins ago' },
      { id: 2, type: 'booking', action: 'New booking created', user: 'Jane Smith', time: '5 mins ago' },
      { id: 3, type: 'fleet', action: 'New fleet added', user: 'Acme Corp', time: '12 mins ago' },
      { id: 4, type: 'trip', action: 'Trip completed', user: 'Driver Mike', time: '18 mins ago' },
    ],
    systemHealth: {
      api: 'operational',
      database: 'operational',
      auth: 'operational',
      notifications: 'degraded'
    }
  };

  const displayMetrics = metrics || mockMetrics;

  const MetricCard = ({ icon, title, value, subtitle, trend, color = 'blue' }) => {
    const getTrendIcon = () => {
      if (trend > 0) return <FaArrowUp className="text-green-500" />;
      if (trend < 0) return <FaArrowDown className="text-red-500" />;
      return <FaMinus className="text-gray-400" />;
    };

    const getTrendColor = () => {
      if (trend > 0) return 'text-green-600';
      if (trend < 0) return 'text-red-600';
      return 'text-gray-600';
    };

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
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'user': return <FaUsers className="text-blue-500" />;
        case 'booking': return <FaCalendarCheck className="text-green-500" />;
        case 'fleet': return <FaTruck className="text-purple-500" />;
        case 'trip': return <FaRoute className="text-orange-500" />;
        default: return <FaCheckCircle className="text-gray-500" />;
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0">
          {getActivityIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.action}
          </p>
          <p className="text-sm text-gray-500">
            {activity.user} • {activity.time}
          </p>
        </div>
      </div>
    );
  };

  const SystemHealthIndicator = ({ service, status }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'operational': return 'bg-green-500';
        case 'degraded': return 'bg-yellow-500';
        case 'down': return 'bg-red-500';
        default: return 'bg-gray-500';
      }
    };

    const getStatusText = () => {
      switch (status) {
        case 'operational': return 'Operational';
        case 'degraded': return 'Degraded';
        case 'down': return 'Down';
        default: return 'Unknown';
      }
    };

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700 capitalize">{service}</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm text-gray-600">{getStatusText()}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchMetrics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">System overview and management</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchMetrics}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={<FaUsers />}
            title="Total Users"
            value={displayMetrics.totalUsers.toLocaleString()}
            subtitle="Registered users"
            trend={displayMetrics.userGrowth}
            color="blue"
          />
          <MetricCard
            icon={<FaTruck />}
            title="Total Fleets"
            value={displayMetrics.totalFleets}
            subtitle="Active fleets"
            trend={displayMetrics.fleetGrowth}
            color="purple"
          />
          <MetricCard
            icon={<FaCalendarCheck />}
            title="Total Bookings"
            value={displayMetrics.totalBookings.toLocaleString()}
            subtitle="All-time bookings"
            trend={displayMetrics.bookingGrowth}
            color="green"
          />
          <MetricCard
            icon={<FaUserCheck />}
            title="Active Users"
            value={displayMetrics.activeUsers}
            subtitle="Currently online"
            color="orange"
          />
          <MetricCard
            icon={<FaRoute />}
            title="Completed Trips"
            value={displayMetrics.completedTrips.toLocaleString()}
            subtitle="Successfully completed"
            color="yellow"
          />
          <MetricCard
            icon={<FaDollarSign />}
            title="Total Revenue"
            value={`$${displayMetrics.totalRevenue.toLocaleString()}`}
            subtitle="Lifetime earnings"
            trend={displayMetrics.revenueGrowth}
            color="green"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-2">
                {(displayMetrics.recentActivity || []).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
              <div className="space-y-3">
                {Object.entries(displayMetrics.systemHealth || {}).map(([service, status]) => (
                  <SystemHealthIndicator
                    key={service}
                    service={service}
                    status={status}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
