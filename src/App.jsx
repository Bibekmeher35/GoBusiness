import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReferralDetail from './pages/ReferralDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/referral/:id" element={
          <ProtectedRoute>
            <ReferralDetail />
          </ProtectedRoute>
        } />
        
        {/* Optional redirect from /dashboard/referrals to / */}
        <Route path="/dashboard/referrals" element={<Navigate to="/" replace />} />
        
        {/* Not Found is public and MUST NOT be wrapped in ProtectedRoute */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
