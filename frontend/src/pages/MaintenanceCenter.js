import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { FaWrench, FaExclamationTriangle, FaCheckCircle, FaCarCrash } from "react-icons/fa";

export default function MaintenanceCenter() {
  const [stats, setStats] = useState([]);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Colors for Pie Chart
  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"]; // Green, Yellow, Red

  useEffect(() => {
    generateMockData();
  }, []);

  // --- SIMULATION LOGIC (Replaces Backend) ---
  const generateMockData = () => {
    // 1. Simulate Fleet Stats
    const mockStats = [
      { name: "Healthy", value: 65 },
      { name: "Due Soon", value: 20 },
      { name: "Critical", value: 15 }
    ];
    setStats(mockStats);

    // 2. Simulate Engine Wear Trends (Last 6 Months)
    const mockTrends = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    let health = 100;
    
    months.forEach(month => {
      // Randomly degrade health by 2-5% per month
      health -= Math.floor(Math.random() * 4) + 2; 
      mockTrends.push({ month, engineHealth: health });
    });
    setTrends(mockTrends);

    // 3. Simulate Alerts
    const mockAlerts = [
      { id: 101, vehicleName: "Truck-A (Logistics)", vehicleId: "V-884", issue: "Brake Pad Wear", severity: "Critical", predictedFailure: "2 Days", status: "Open" },
      { id: 102, vehicleName: "Van-X (Delivery)", vehicleId: "V-102", issue: "Oil Change Due", severity: "Moderate", predictedFailure: "14 Days", status: "Open" },
      { id: 103, vehicleName: "Sedan-B (Taxi)", vehicleId: "V-331", issue: "Low Tire Pressure", severity: "Low", predictedFailure: "30 Days", status: "Open" },
      { id: 104, vehicleName: "Truck-C (Freight)", vehicleId: "V-992", issue: "Engine Overheat", severity: "Critical", predictedFailure: "Immediate", status: "Open" }
    ];
    setAlerts(mockAlerts);
  };

  // Handle "Resolve" Action locally
  const resolveAlert = (id) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, status: "Resolved" } : alert
    );
    // Filter out resolved ones to clear the table, or keep them with a checkmark
    setAlerts(updatedAlerts.filter(a => a.status === "Open"));
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f4f7f6" }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px", display:'flex', alignItems:'center', gap:'10px' }}>
          <FaCarCrash size={24} color="#e74c3c"/> Predictive Maintenance Center
        </h2>

        {/* --- TOP ROW: CHARTS --- */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          
          {/* 1. Pie Chart: Fleet Health */}
          <div style={cardStyle}>
            <h3 style={{marginBottom:'15px', color:'#555'}}>Fleet Health Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Line Chart: Engine Degradation */}
          <div style={cardStyle}>
            <h3 style={{marginBottom:'15px', color:'#555'}}>Engine Wear Trend (Vehicle #V-884)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} label={{ value: 'Health %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engineHealth" stroke="#8884d8" strokeWidth={3} name="Health %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- BOTTOM ROW: ALERTS TABLE --- */}
        <div style={{ ...cardStyle, width: "auto" }}>
          <h3 style={{marginBottom:'15px', color:'#555'}}>⚠️ Critical Alerts & Action Items</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
            <thead>
              <tr style={{ background: "#ecf0f1", textAlign: "left" }}>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Issue Detected</th>
                <th style={thStyle}>Severity</th>
                <th style={thStyle}>Predicted Failure</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr><td colSpan="5" style={{padding: "20px", textAlign:"center", color:"green"}}>All systems operational! ✅</td></tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>
                      <strong>{alert.vehicleName}</strong> <br/>
                      <span style={{fontSize:"12px", color:"#7f8c8d"}}>ID: {alert.vehicleId}</span>
                    </td>
                    <td style={tdStyle}>{alert.issue}</td>
                    <td style={tdStyle}>
                      <span style={getSeverityStyle(alert.severity)}>{alert.severity}</span>
                    </td>
                    <td style={tdStyle}>{alert.predictedFailure}</td>
                    <td style={tdStyle}>
                      <button onClick={() => resolveAlert(alert.id)} style={btnStyle}>
                        <FaWrench /> Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  flex: 1,
  minWidth: "300px"
};

const thStyle = { padding: "12px", color: "#2c3e50", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px", color: "#34495e" };

const btnStyle = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "500",
  transition: "0.2s"
};

const getSeverityStyle = (severity) => {
  const base = { padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" };
  if (severity === "Critical") return { ...base, background: "#fadbd8", color: "#c0392b" };
  if (severity === "Moderate") return { ...base, background: "#fdebd0", color: "#d35400" };
  return { ...base, background: "#d4efdf", color: "#27ae60" };
};