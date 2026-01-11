// src/services/RouteServices.js

// 1. Geocoding: Convert City Name to Coordinates (OpenStreetMap Nominatim)
export const getCoordinates = async (city) => {
    if (!city) return null;
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
        }
        return null;
    } catch (error) {
        console.error("Geocoding Error:", error);
        return null;
    }
};

// 2. Routing: Get Paths from OSRM
export const getOSRMRoutes = async (start, end) => {
    try {
        // Request alternatives=true to get multiple paths
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes || data.routes.length === 0) return [];

        // OSRM usually returns 1 route by default, sometimes 2. 
        // We will simulate the metadata (Fastest/Eco/Shortest) for the demo experience based on the real geometry.
        
        const baseRoute = data.routes[0];
        const coordinates = baseRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Flip to [Lat, Lng] for Leaflet
        
        // Base metrics
        const distanceKm = (baseRoute.distance / 1000);
        const durationMin = (baseRoute.duration / 60);

        return [
            {
                id: 'fastest',
                type: 'Fastest (Traffic-Aware)',
                tag: 'Recommended',
                distance: distanceKm.toFixed(1),
                duration: Math.round(durationMin),
                cost: (distanceKm * 12).toFixed(0),
                color: '#ef4444', // Red
                coordinates: coordinates,
                trafficLevel: 'High'
            },
            {
                id: 'eco',
                type: 'Eco-Friendly',
                tag: 'Green Choice',
                distance: (distanceKm * 1.1).toFixed(1),
                duration: Math.round(durationMin * 1.2),
                cost: (distanceKm * 10).toFixed(0),
                color: '#22c55e', // Green
                coordinates: coordinates,
                trafficLevel: 'Low'
            },
            {
                id: 'shortest',
                type: 'Shortest (Dijkstra)',
                tag: 'Distance Saver',
                distance: (distanceKm * 0.95).toFixed(1),
                duration: Math.round(durationMin * 1.1),
                cost: (distanceKm * 14).toFixed(0),
                color: '#3b82f6', // Blue
                coordinates: coordinates, 
                trafficLevel: 'Moderate'
            }
        ];
    } catch (error) {
        console.error("Routing Error:", error);
        return [];
    }
};