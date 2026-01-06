import { useContext } from "react";
import { VehicleContext } from "../context/VehicleContext";
import Sidebar from "../components/Sidebar";

export default function LoadOptimization() {
  const { vehicles } = useContext(VehicleContext);

  if (!vehicles || vehicles.length === 0) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>Load Optimization</h2>
          <p>No vehicles available. Please add vehicles first.</p>
        </div>
      </div>
    );
  }

  const optimized = vehicles.map((v) => {
    // Randomly simulate load for demo purposes
    const load = Math.floor(Math.random() * 120);

    let status =
      load < 40 ? "Underloaded" :
      load <= 80 ? "Balanced" :
      "Overloaded";

    return { ...v, load, status };
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Load Optimization</h2>

        <div className="grid">
          {optimized.map((v) => (
            <div className="card" key={v.id}>
              <h3>{v.name}</h3>
              <p>Type: {v.type}</p>
              <p>Load: {v.load}%</p>
              <p>Status: {v.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
