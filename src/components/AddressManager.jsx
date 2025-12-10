import React, { useState, useEffect } from "react";
import LeafletLocationPicker from "./LeafletLocationPicker";

export default function AddressManager({ onClose }) {
  const [addresses, setAddresses] = useState([]);
  const [manualText, setManualText] = useState("");
  const [tempLocation, setTempLocation] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // Load from storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(saved);
  }, []);

  const saveToStorage = (list) => {
    setAddresses(list);
    localStorage.setItem("addresses", JSON.stringify(list));
  };

  // Add manual
  const addManual = () => {
    if (!manualText.trim()) return;

    const newEntry = {
      address: manualText,
      latitude: null,
      longitude: null,
    };

    saveToStorage([...addresses, newEntry]);
    setManualText("");
  };

  // After map picks a location, store temporarily
  const handleLocationSelected = (loc) => {
    setTempLocation(loc);
  };

  // Confirm adding map location to saved list
  const confirmAddLocation = () => {
    if (!tempLocation) return;
    saveToStorage([...addresses, tempLocation]);

    setTempLocation(null);
    setShowPicker(false);
  };

  // Current location button
  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      // Reverse geocode
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();

      setTempLocation({
        address: data.display_name || "Unknown location",
        latitude,
        longitude,
      });
    });
  };

  // Delete address
  const deleteAddress = (i) => {
    const updated = addresses.filter((_, idx) => idx !== i);
    saveToStorage(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="w-[460px] bg-white p-5 rounded-2xl shadow-xl max-h-[88vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Manage Addresses</h2>
          <button onClick={onClose} className="text-2xl font-bold">✕</button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Enter your address..."
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={addManual}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {showPicker ? "Close Map Picker" : "Pick From Map"}
          </button>

        </div>

        {showPicker && (
          <div className="mb-4">
            <LeafletLocationPicker onSelect={handleLocationSelected} />
          </div>
        )}

        {tempLocation && (
          <div className="bg-yellow-100 p-3 rounded-lg mb-4">
            <div className="font-medium">{tempLocation.address}</div>
            <button
              onClick={confirmAddLocation}
              className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Save This Address
            </button>

            <button
              onClick={() => setTempLocation(null)}
              className="mt-2 w-full py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        <h3 className="mt-3 mb-2 font-semibold">Saved Addresses</h3>

        {addresses.length === 0 && (
          <p className="text-gray-500 text-sm mb-2">No addresses saved.</p>
        )}

        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-gray-100 p-3 rounded-lg flex justify-between items-center mb-2"
          >
            <div className="text-sm">
              <div className="font-medium">{addr.address}</div>
              {addr.latitude && (
                <div className="text-xs text-gray-600">
                  Lat {addr.latitude.toFixed(4)}, Lng {addr.longitude.toFixed(4)}
                </div>
              )}
            </div>

            <button
              onClick={() => deleteAddress(i)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
