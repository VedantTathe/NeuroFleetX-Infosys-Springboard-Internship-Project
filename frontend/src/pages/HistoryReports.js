import Sidebar from "../components/Sidebar"; // Sidebar component
import { load } from "../utils/storage"; // Your storage utility

export default function HistoryReports() {
  // Load history from localStorage
  const history = load("history", []);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Route History</h2>

        {history.length === 0 ? (
          <p>No history yet</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  background: "#fff",
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>
                  {h.type || "Unknown"}
                </h3>
                <p>Distance: {h.distance ? h.distance.toFixed(2) : "N/A"} km</p>
                <p>Fuel saved: {h.savings ?? "N/A"}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
