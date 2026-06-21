import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-code">404</div>
      <h1 className="notfound-message">Page not found</h1>
      <Link to="/" style={{ color: '#4031e4ff', fontWeight: 500}}>
        Back to dashboard
      </Link>
    </div>
  );
}

export default NotFound;
