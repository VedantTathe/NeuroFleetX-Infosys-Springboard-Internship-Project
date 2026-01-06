// utils/optimization.js
export function getDistanceKm(a, b) {
  const R = 6371; // Earth radius in km
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;

  const x = Math.sin(dLat/2)**2 + Math.sin(dLng/2)**2 * Math.cos(lat1)*Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  return R * c;
}

// Shortest route
export function shortestRoute(points) {
  const distance = getDistanceKm(points[0], points[1]);
  const speed = 40; // km/h
  const eta = distance / speed; // hours
  return { type: "Shortest", distance, eta, points };
}

// Traffic-aware route
export function trafficAware(points) {
  const distance = getDistanceKm(points[0], points[1]) * 1.2; // traffic increases distance/time
  const speed = 35;
  const eta = distance / speed;
  return { type: "Traffic-Aware", distance, eta, points };
}

// Eco-friendly route
export function ecoRoute(points) {
  const distance = getDistanceKm(points[0], points[1]) * 1.1;
  const speed = 30;
  const eta = distance / speed;
  return { type: "Eco-Friendly", distance, eta, points };
}
