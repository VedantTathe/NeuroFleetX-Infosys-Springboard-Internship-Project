import { useContext, useState } from "react";
import { VehicleContext } from "../context/VehicleContext";
import Sidebar from "../components/Sidebar"; // <-- Import Sidebar

export default function FleetManager() {
  const { vehicles, addVehicle, removeVehicle, simulateTelemetry } =
    useContext(VehicleContext);

  const [form, setForm] = useState({ name: "", type: "Truck" });

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main page content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Fleet Manager</h2>

        <div className="card">
          <input
            placeholder="Vehicle name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Bike</option>
            <option>Car</option>
            <option>Truck</option>
          </select>

          <button onClick={() => addVehicle(form)}>Add Vehicle</button>
        </div>

        <div className="grid">
          {vehicles.map((v) => (
            <div className="card" key={v.id}>
              <h4>{v.name}</h4>
              <p>{v.type}</p>
              <p>Status: {v.status}</p>
              <p>Battery: {v.battery || 0}%</p>
              <button onClick={() => simulateTelemetry(v.id)}>Simulate</button>
              <button onClick={() => removeVehicle(v.id)} className="danger">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
