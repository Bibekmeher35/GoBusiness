import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// A wrapper component that blocks access to unauthorized pages
function ProtectedRoute({ children }) {
  const token = Cookies.get('jwt_token');

  // Send the user to the login screen if they aren't logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, let them view the requested page
  return children;
}

export default ProtectedRoute;
