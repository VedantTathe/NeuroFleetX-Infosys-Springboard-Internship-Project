import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { FaDownload, FaFileCsv, FaFilePdf } from 'react-icons/fa';

const Reports = () => {
  // Mock Data
  const monthlyData = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
  ];

  const fleetStatusData = [
    { name: 'Active', value: 45, color: '#10b981' },
    { name: 'Maintenance', value: 15, color: '#f59e0b' },
    { name: 'Idle', value: 10, color: '#6b7280' },
  ];

  const handleDownload = (format) => {
    alert(`Downloading ${format} report... (Simulation)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
             <p className="text-gray-500">Financial & Operational Analytics</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => handleDownload('CSV')} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium shadow-sm">
                <FaFileCsv className="text-green-600" /> Export CSV
             </button>
             <button onClick={() => handleDownload('PDF')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm">
                <FaFilePdf /> Generate PDF
             </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* 1. Profit/Loss Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue vs Expenses</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Income" />
                            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Costs" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Fleet Utilization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Fleet Utilization Status</h3>
                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={fleetStatusData}
                                cx="50%" cy="50%"
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {fleetStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="middle" align="right" layout="vertical" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800">Monthly Financial Summary</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Month</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total Revenue</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total Expenses</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Net Profit</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Growth</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {monthlyData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                            <td className="px-6 py-4 text-sm text-right text-green-600 font-mono">${row.revenue.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-right text-red-500 font-mono">${row.expenses.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-right font-bold font-mono">${(row.revenue - row.expenses).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;