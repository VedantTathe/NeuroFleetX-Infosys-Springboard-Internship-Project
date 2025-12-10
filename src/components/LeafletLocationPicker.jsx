import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletLocationPicker({ onSelect }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    // Destroy previous map instance to avoid duplicates
    if (map.current) {
      map.current.off();
      map.current.remove();
    }

    // Create new map
    map.current = L.map(mapContainer.current).setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map.current);

    // Click listener
    map.current.on("click", (e) => {
      placeMarker(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (map.current) {
        map.current.off();
        map.current.remove();
      }
    };
  }, []);

  const placeMarker = (location) => {
    if (marker.current) {
      marker.current.setLatLng(location);
    } else {
      marker.current = L.marker(location).addTo(map.current);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "VedantApp/1.0",
        },
      });

      const data = await res.json();

      const address = data.display_name || "Unknown address";

      onSelect({
        address,
        latitude: lat,
        longitude: lng,
      });
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        map.current.setView([latitude, longitude], 16);
        placeMarker({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      () => {
        alert("Unable to fetch location.");
      }
    );
  };

  return (
    <div className="space-y-2">
      <button
        onClick={detectLocation}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
      >
        Use Current Location
      </button>

      <div
        ref={mapContainer}
        className="w-full h-72 rounded-xl border shadow-sm"
      ></div>
    </div>
  );
}
