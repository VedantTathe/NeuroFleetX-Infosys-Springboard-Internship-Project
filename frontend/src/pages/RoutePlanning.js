import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// Geocoding using OpenStreetMap / Nominatim
const geocodePlace = async (place) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    place
  )}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length === 0) return null;
  return `${data[0].lat},${data[0].lon}`;
};

export default function RoutePlanning() {
  const nav = useNavigate();
  const [trip, setTrip] = useState({
    start: "",
    dest: "",
    stops: [],
    optimization: "Shortest Time",
    vehicle: "Car",
  });
  const [stopInput, setStopInput] = useState("");

  const addStop = () => {
    if (stopInput.trim() !== "") {
      setTrip({ ...trip, stops: [...trip.stops, stopInput] });
      setStopInput("");
    }
  };

  const removeStop = (index) => {
    const updated = [...trip.stops];
    updated.splice(index, 1);
    setTrip({ ...trip, stops: updated });
  };

  const submit = async () => {
    if (!trip.start || !trip.dest) {
      alert("Enter start and destination");
      return;
    }

    const startLatLng = await geocodePlace(trip.start);
    const destLatLng = await geocodePlace(trip.dest);
    if (!startLatLng || !destLatLng) {
      alert("Could not find start or destination location");
      return;
    }

    const stopLatLngs = [];
    for (let stop of trip.stops) {
      const stopLatLng = await geocodePlace(stop);
      if (stopLatLng) stopLatLngs.push(stopLatLng);
    }

    const tripToSave = {
      ...trip,
      start: startLatLng,
      dest: destLatLng,
      stops: stopLatLngs,
    };

    localStorage.setItem("routeTrip", JSON.stringify(tripToSave));
    nav("/eta");
  };

  // ---------- STYLING ----------
  const labelStyle = { fontWeight: "600", marginTop: "15px", display: "block" };
  
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    marginTop: "5px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "0.3s",
    boxSizing: "border-box" // Added to ensure padding doesn't affect width
  };

  const buttonStyle = {
    padding: "12px 20px",
    backgroundColor: "#1E90FF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "0.3s",
  };

  const stopButtonStyle = {
    padding: "6px 12px",
    backgroundColor: "#FF4500",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "8px",
    transition: "0.3s",
  };

  const stopListStyle = { marginTop: "10px", paddingLeft: "20px" };
  
  const cardStyle = {
    background: "#f8f9fa",
    padding: "15px 20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginTop: "10px",
  };

  // Helper for focus events
  const handleFocus = (e) => {
    e.target.style.borderColor = "#1E90FF";
    e.target.style.boxShadow = "0 0 5px rgba(30,144,255,0.4)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#ccc";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px", color: "#1E90FF" }}>Plan Your Trip</h2>

        <label style={labelStyle}>Start Location</label>
        <input
          style={inputStyle}
          placeholder="e.g., Visakhapatnam"
          value={trip.start}
          onChange={(e) => setTrip({ ...trip, start: e.target.value })}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <label style={labelStyle}>Destination</label>
        <input
          style={inputStyle}
          placeholder="e.g., Vijayawada"
          value={trip.dest}
          onChange={(e) => setTrip({ ...trip, dest: e.target.value })}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <label style={labelStyle}>Stops / Waypoints (optional)</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Stop location"
            value={stopInput}
            onChange={(e) => setStopInput(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button style={stopButtonStyle} onClick={addStop}>Add Stop</button>
        </div>

        {trip.stops.length > 0 && (
          <ul style={stopListStyle}>
            {trip.stops.map((s, i) => (
              <li key={i} style={cardStyle}>
                {s} <button style={stopButtonStyle} onClick={() => removeStop(i)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <label style={labelStyle}>Optimization Preference</label>
        <select
          style={inputStyle}
          value={trip.optimization}
          onChange={(e) => setTrip({ ...trip, optimization: e.target.value })}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <option>Shortest Time</option>
          <option>Least Traffic</option>
          <option>Energy Efficient</option>
        </select>

        <label style={labelStyle}>Vehicle Type</label>
        <select
          style={inputStyle}
          value={trip.vehicle}
          onChange={(e) => setTrip({ ...trip, vehicle: e.target.value })}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <option>Bike</option>
          <option>Car</option>
          <option>Truck</option>
        </select>

        <button style={buttonStyle} onClick={submit}>Plan Trip</button>
      </div>
    </div>
  );
}