
import "./App.css";
import "./styles.css";

import { Routes, Route, Navigate } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import VehicleProvider from "./context/VehicleContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

import FleetManager from "./pages/FleetManager";
import RoutePlanning from "./pages/RoutePlanning";
import RouteMapView from "./pages/RouteMapView";
import ETAComparison from "./pages/ETAComparison";
import LoadOptimization from "./pages/LoadOptimization";
import LiveTracking from "./pages/LiveTracking";
import HistoryReports from "./pages/HistoryReports";
import TrafficAnalytics from "./pages/TrafficAnalytics";
import Settings from "./pages/Settings";

import PrivateRoute from "./routes/PrivateRoute";
import MaintenanceCenter from "./pages/MaintenanceCenter";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingSystem from "./pages/BookingSystem";

function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <Routes>
          {/* Default route redirect */}
          <Route path="/" element={<Navigate to="/Login" />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/fleet" element={
            <PrivateRoute><FleetManager /></PrivateRoute>
          } />
          <Route path="/plan" element={
            <PrivateRoute><RoutePlanning /></PrivateRoute>
          } />
          <Route path="/map" element={
            <PrivateRoute><RouteMapView /></PrivateRoute>
          } />
          <Route path="/eta" element={
            <PrivateRoute><ETAComparison /></PrivateRoute>
          } />
          <Route path="/load" element={
            <PrivateRoute><LoadOptimization /></PrivateRoute>
          } />
          <Route path="/live-tracking" element={
            <PrivateRoute><LiveTracking /></PrivateRoute>
          } />
          <Route path="/traffic" element={
            <PrivateRoute><TrafficAnalytics /></PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute><HistoryReports /></PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute><Settings /></PrivateRoute>
          } />
          <Route path="/maintainance" element={
            <PrivateRoute><MaintenanceCenter /></PrivateRoute>
          } />
          <Route path="/customer-dashboard" element={
          <PrivateRoute><CustomerDashboard /></PrivateRoute> 
          }/>
          <Route path="/booking" element={
          <PrivateRoute><BookingSystem /></PrivateRoute> 
          }/>
        </Routes>
      </VehicleProvider>
    </AuthProvider>
  );
}

export default App;
