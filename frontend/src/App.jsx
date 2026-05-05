// frontend/src/App.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LostItemsPage = lazy(() => import('./pages/LostItemsPage'));
const FoundItemsPage = lazy(() => import('./pages/FoundItemsPage'));
const ItemDetailPage = lazy(() => import('./pages/ItemDetailPage'));
const ReportLostPage = lazy(() => import('./pages/ReportLostPage'));
const ReportFoundPage = lazy(() => import('./pages/ReportFoundPage'));
const MyItemsPage = lazy(() => import('./pages/MyItemsPage'));
const MyClaimsPage = lazy(() => import('./pages/MyClaimsPage'));
const IncomingClaimsPage = lazy(() => import('./pages/IncomingClaimsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/lost-items" element={<LostItemsPage />} />
            <Route path="/found-items" element={<FoundItemsPage />} />
            <Route path="/items/:type/:id" element={<ItemDetailPage />} />
            <Route path="/report-lost" element={<ProtectedRoute><ReportLostPage /></ProtectedRoute>} />
            <Route path="/report-found" element={<ProtectedRoute><ReportFoundPage /></ProtectedRoute>} />
            <Route path="/my-items" element={<ProtectedRoute><MyItemsPage /></ProtectedRoute>} />
            <Route path="/my-claims" element={<ProtectedRoute><MyClaimsPage /></ProtectedRoute>} />
            <Route path="/incoming-claims" element={<ProtectedRoute><IncomingClaimsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['ROLE_ADMIN','ROLE_STAFF']}><AdminDashboardPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
