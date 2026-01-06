import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { 
  FaCar, FaLeaf, FaMapMarkerAlt, FaStar, FaRoute 
} from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export default function CustomerDashboard() {
  const nav = useNavigate();
  const [activeTrip, setActiveTrip] = useState(null);
  const [stats, setStats] = useState({ rides: 0, distance: 0, co2Saved: 0 });

  useEffect(() => {
    // --- SIMULATE DATA FETCHING ---
    
    // 1. Mock User Stats
    setStats({
      rides: 42,
      distance: 650, // km
      co2Saved: 28   // kg
    });

    // 2. Mock Active Trip (Simulate a trip happening now)
    // Set to null to see "No active trip" state
    setActiveTrip({
      id: "TRIP-8821",
      driver: "John Doe",
      vehicle: "Tesla Model 3",
      plate: "AP02-EV-999",
      status: "Arriving", // Arriving, In Progress
      eta: "5 mins",
      pickup: "Visakhapatnam Airport",
      drop: "Tech Park, Hill No. 3",
      progress: 30 // for progress bar
    });

  }, []);

  // Mock Data for "Travel Activity" Chart
  const chartData = [
    { day: "Mon", km: 12 }, { day: "Tue", km: 45 }, { day: "Wed", km: 20 },
    { day: "Thu", km: 0 }, { day: "Fri", km: 35 }, { day: "Sat", km: 10 }, { day: "Sun", km: 55 }
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ margin: 0, color: "#1e293b", fontSize: "28px" }}>Hello, Pranathi! 👋</h1>
            <p style={{ color: "#64748b", marginTop: "5px" }}>Welcome to your personal mobility hub.</p>
          </div>
          <button onClick={() => nav("/booking")} style={bookBtnStyle}>
            <FaCar /> Book a New Ride
          </button>
        </div>

        {/* --- STATS CARDS --- */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
          <StatCard icon={<FaCar />} color="#3b82f6" label="Total Rides" value={stats.rides} sub="Lifetime trips" />
          <StatCard icon={<FaRoute />} color="#8b5cf6" label="Distance" value={`${stats.distance} km`} sub="Travelled total" />
          <StatCard icon={<FaLeaf />} color="#10b981" label="Eco Impact" value={`${stats.co2Saved} kg`} sub="CO2 Emissions Saved" />
        </div>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          
          {/* LEFT COL: ACTIVE TRIP & HISTORY */}
          <div style={{ flex: 2, minWidth: "300px" }}>
            
            {/* 1. ACTIVE TRIP CARD */}
            <div style={sectionStyle}>
              <h3 style={sectionHeaderStyle}>Current Trip</h3>
              {activeTrip ? (
                <div style={activeTripCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <div style={driverAvatarStyle}>{activeTrip.driver.charAt(0)}</div>
                      <div>
                        <h4 style={{ margin: 0, color: "#fff" }}>{activeTrip.driver}</h4>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>{activeTrip.vehicle} • {activeTrip.plate}</div>
                      </div>
                    </div>
                    <div style={statusBadgeStyle}>{activeTrip.status} • {activeTrip.eta}</div>
                  </div>

                  {/* Route Visual */}
                  <div style={{ position: "relative", paddingLeft: "20px", borderLeft: "2px dashed rgba(255,255,255,0.3)", marginLeft: "10px" }}>
                    <div style={{ position: "absolute", left: "-6px", top: "0", width: "10px", height: "10px", background: "#fff", borderRadius: "50%" }}></div>
                    <div style={{ position: "absolute", left: "-6px", bottom: "0", width: "10px", height: "10px", background: "#4ade80", borderRadius: "50%" }}></div>
                    
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>PICKUP</div>
                      <div style={{ fontWeight: "500", color: "#fff" }}>{activeTrip.pickup}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>DROP OFF</div>
                      <div style={{ fontWeight: "500", color: "#fff" }}>{activeTrip.drop}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button onClick={() => nav("/live-tracking")} style={actionBtnStyle}>Track Live</button>
                    <button style={{ ...actionBtnStyle, background: "rgba(255,255,255,0.2)" }}>Call Driver</button>
                  </div>
                </div>
              ) : (
                <div style={emptyStateStyle}>
                  <FaCar size={40} color="#cbd5e1" />
                  <p>No active trips right now.</p>
                  <button onClick={() => nav("/booking")} style={linkBtnStyle}>Start a new journey</button>
                </div>
              )}
            </div>

            {/* 2. RECENT ACTIVITY */}
            <div style={{ ...sectionStyle, marginTop: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={sectionHeaderStyle}>Recent Activity</h3>
                <button onClick={() => nav("/history")} style={linkBtnStyle}>View All</button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <HistoryItem date="Yesterday" dest="City Mall" price="$12.50" rating={5} />
                <HistoryItem date="Oct 24" dest="Railway Station" price="$8.00" rating={4} />
                <HistoryItem date="Oct 20" dest="Office Campus" price="$15.20" rating={5} />
              </div>
            </div>

          </div>

          {/* RIGHT COL: ANALYTICS & PROMOS */}
          <div style={{ flex: 1, minWidth: "250px" }}>
            
            {/* 3. WEEKLY ACTIVITY CHART */}
            <div style={sectionStyle}>
              <h3 style={sectionHeaderStyle}>Weekly Travel</h3>
              <div style={{ height: "200px", width: "100%", marginTop: "10px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Tooltip 
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    />
                    <XAxis dataKey="day" hide />
                    <Line type="monotone" dataKey="km" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "10px" }}>
                You travelled <strong>177 km</strong> this week.
              </p>
            </div>

            {/* 4. AI RECOMMENDATION CARD */}
            <div style={{ ...sectionStyle, marginTop: "20px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <FaLeaf /> <strong>Eco Tip</strong>
              </div>
              <p style={{ fontSize: "14px", lineHeight: "1.5", opacity: 0.9 }}>
                Based on your route history, switching to an <strong>EV</strong> for your daily commute could save you <strong>$45/month</strong>.
              </p>
              <button onClick={() => nav("/booking")} style={{ ...actionBtnStyle, background: "white", color: "#059669", marginTop: "15px", width: "100%" }}>
                Book an EV Now
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon, color, label, value, sub }) {
  return (
    <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "15px", minWidth: "200px" }}>
      <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: `${color}20`, display: "flex", justifyContent: "center", alignItems: "center", color: color, fontSize: "24px" }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b" }}>{value}</div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{sub}</div>
      </div>
    </div>
  );
}

function HistoryItem({ date, dest, price, rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{ background: "#e2e8f0", padding: "10px", borderRadius: "50%", color: "#64748b" }}><FaMapMarkerAlt /></div>
        <div>
          <div style={{ fontWeight: "600", color: "#334155" }}>{dest}</div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{date} • {rating} <FaStar color="#f59e0b" size={10} /></div>
        </div>
      </div>
      <div style={{ fontWeight: "700", color: "#1e293b" }}>{price}</div>
    </div>
  );
}

// --- STYLES ---

const sectionStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const sectionHeaderStyle = {
  margin: 0,
  fontSize: "18px",
  color: "#1e293b"
};

const bookBtnStyle = {
  background: "#1e293b",
  color: "white",
  padding: "12px 24px",
  borderRadius: "8px",
  border: "none",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  boxShadow: "0 4px 12px rgba(30, 41, 59, 0.2)"
};

const activeTripCardStyle = {
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  borderRadius: "12px",
  padding: "20px",
  color: "white",
  marginTop: "15px",
  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)"
};

const driverAvatarStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "700"
};

const statusBadgeStyle = {
  background: "rgba(255,255,255,0.2)",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  height: "fit-content"
};

const actionBtnStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "white",
  color: "#2563eb",
  fontWeight: "600",
  cursor: "pointer"
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "30px",
  color: "#94a3b8"
};

const linkBtnStyle = {
  background: "none",
  border: "none",
  color: "#3b82f6",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px"
};