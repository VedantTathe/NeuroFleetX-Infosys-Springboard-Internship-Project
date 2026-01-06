import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './utils/authUtils';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Dashboards
import AdminDashboard from './dashboards/AdminDashboard';
import FleetManagerDashboard from './dashboards/FleetManagerDashboard';
import DriverDashboard from './dashboards/DriverDashboard';
import CustomerDashboard from './dashboards/CustomerDashboard';

// CSS
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Default route redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <div>
                    <Navbar />
                    <AdminDashboard />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Protected Fleet Manager routes */}
            <Route
              path="/fleet-manager/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.FLEET_MANAGER]}>
                  <div>
                    <Navbar />
                    <FleetManagerDashboard />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Protected Driver routes */}
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
                  <div>
                    <Navbar />
                    <DriverDashboard />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Protected Customer routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                  <div>
                    <Navbar />
                    <CustomerDashboard />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Catch all route - redirect to unauthorized */}
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
