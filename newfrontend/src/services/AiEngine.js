// File: src/services/AiEngine.js

export const getSmartRoutes = async (startCity, endCity) => {
  // Simulate API Network Delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`🤖 AI Engine: Calculating routes from ${startCity} to ${endCity}...`);

  // Mock Route Data (Pune to Lonavala)
  return {
    start: { lat: 18.5204, lng: 73.8567, name: startCity },
    end: { lat: 18.7549, lng: 73.4056, name: endCity },
    routes: [
      {
        id: 1,
        label: "AI Recommended (Fastest)",
        color: "#10b981", // Green
        distance: "64 km",
        duration: "1h 12m",
        coordinates: [
          [18.5204, 73.8567], // Pune
          [18.5800, 73.7800],
          [18.6500, 73.6800],
          [18.7549, 73.4056]  // Lonavala
        ]
      },
      {
        id: 2,
        label: "Alternative (Traffic Free)",
        color: "#6366f1", // Indigo
        distance: "70 km",
        duration: "1h 30m",
        coordinates: [
          [18.5204, 73.8567],
          [18.5000, 73.9000], // Detour
          [18.6000, 73.7500],
          [18.7549, 73.4056]
        ]
      }
    ]
  };
};

export const optimizeFleetLoad = (vehicles) => {
  console.log("⚖️ AI Engine: Balancing Loads...");
  // Redistribute capacity randomly between 50-90%
  return vehicles.map(v => ({
    ...v,
    capacity: v.status === 'Active' ? Math.floor(Math.random() * 40) + 50 : 0
  }));
};