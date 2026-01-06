import { createContext, useState, useEffect } from "react";
import { load, save } from "../utils/storage";
import { v4 } from "uuid";

export const VehicleContext = createContext();

export default function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState(load("vehicles", []));

  useEffect(() => save("vehicles", vehicles), [vehicles]);

  const addVehicle = (v) =>
    setVehicles([...vehicles, { ...v, id: v4(), status: "Available" }]);

  const updateVehicle = (id, data) =>
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...data } : v));

  const removeVehicle = (id) =>
    setVehicles(vehicles.filter(v => v.id !== id));

  const simulateTelemetry = (id) =>
    updateVehicle(id, {
      battery: Math.floor(Math.random() * 100),
      fuel: Math.floor(Math.random() * 100),
      lat: 17.25 + Math.random() / 10,
      lng: 82.5 + Math.random() / 10,
      health: Math.floor(Math.random() * 100)
    });

  return (
    <VehicleContext.Provider
      value={{ vehicles, addVehicle, updateVehicle, removeVehicle, simulateTelemetry }}
    >
      {children}
    </VehicleContext.Provider>
  );
}
