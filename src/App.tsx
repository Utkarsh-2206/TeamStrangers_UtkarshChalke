import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { JudgeDemoBar } from './components/common/JudgeDemoBar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkersPage } from './pages/WorkersPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutSafetyPage } from './pages/AboutSafetyPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CreateBookingPage } from './pages/customer/CreateBookingPage';
import { BookingDetailsPage } from './pages/customer/BookingDetailsPage';
import { BookingHistoryPage } from './pages/customer/BookingHistoryPage';

// Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerProfileEditPage } from './pages/worker/WorkerProfileEditPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/workers" element={<WorkersPage />} />
              <Route path="/worker-profile/:workerId" element={<WorkerProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about-safety" element={<AboutSafetyPage />} />

              {/* Customer Protected Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <CreateBookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:workerId"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <CreateBookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/history"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <BookingHistoryPage />
                  </ProtectedRoute>
                }
              />

              {/* Booking Details (Accessible to participating roles) */}
              <Route
                path="/booking/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Worker Protected Routes */}
              <Route
                path="/worker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin']}>
                    <WorkerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/profile-edit"
                element={
                  <ProtectedRoute allowedRoles={['worker', 'admin']}>
                    <WorkerProfileEditPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <JudgeDemoBar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
