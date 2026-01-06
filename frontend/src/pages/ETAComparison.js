import { shortestRoute, trafficAware, ecoRoute } from "../utils/optimization";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function ETAComparison() {
  const nav = useNavigate();

  let trip = null;

  try {
    const saved = localStorage.getItem("routeTrip");
    if (saved) trip = JSON.parse(saved);
  } catch (e) {
    console.error("Parsing error:", e);
  }

  if (!trip) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ padding: 20 }}>
          <h2>No trip data found</h2>
          <p>Please go back and plan a trip again.</p>
        </div>
      </div>
    );
  }

  const parseLatLng = (str) => {
    if (!str || !str.includes(",")) return { lat: 0, lng: 0 };
    const parts = str.split(",").map(Number);
    return { lat: parts[0], lng: parts[1] };
  };

  const start = parseLatLng(trip.start);
  const dest = parseLatLng(trip.dest);
  
  const stops = (trip.stops || []).map(parseLatLng);
  const points = [start, ...stops, dest];

  const routes = [
    shortestRoute(points),
    trafficAware(points),
    ecoRoute(points),
  ];

  const selectRoute = (r) => {

    const routeData = {
      ...r,
      start: start,  // Passing the clean objects {lat, lng}
      dest: dest,    // Passing the clean objects {lat, lng}
    
    };

    localStorage.setItem("selectedRoute", JSON.stringify(routeData));
    
    nav("/live-tracking"); 
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Compare Routes</h2>

        <div className="grid">
          {routes.map((r, i) => (
            <div className="card" key={i}>
              <h3>{r.type}</h3>
              <p>Distance: {r.distance.toFixed(2)} km</p>
              <p>ETA: {(r.eta * 60).toFixed(0)} mins</p>

              <button onClick={() => selectRoute(r)}>
                Select this route
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}