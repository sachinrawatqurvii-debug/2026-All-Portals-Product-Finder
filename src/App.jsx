// App.jsx - SIMPLER VERSION
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import OMSUpload from './components/upload/OmsUpload';
import ShopifyUpload from './components/upload/ShopifyUpload';
import NykaaUpload from './components/upload/NykaaUpload';
import MyntraUpload from './components/upload/MyntraUpload';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Check if current page is auth page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Don't show navbar on auth pages
  const showNavbar = !isAuthPage && user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'pt-16' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Other protected routes can be added here */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/oms-report"
            element={
              <ProtectedRoute>
                <OMSUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shopify_report"
            element={
              <ProtectedRoute>
                <ShopifyUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nykaa_report"
            element={
              <ProtectedRoute>
                <NykaaUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myntra_report"
            element={
              <ProtectedRoute>
                <MyntraUpload />
              </ProtectedRoute>
            }
          />



          {/* Redirect based on auth status */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// Example Products Page Component
const ProductsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products Management</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <p>Products page content goes here...</p>
      </div>
    </div>
  );
};

export default App;