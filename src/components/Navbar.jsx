import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link 
          to="/" 
          className="navbar-brand" 
          aria-label="Go to dashboard home"
        >
          Go Business
        </Link>
        <nav className="navbar-nav" aria-label="Primary">
          <button 
            type="button" 
            className="btn-try-free"
          >
            Try for free
          </button>
          <button 
            type="button" 
            className="btn-logout-pill" 
            onClick={handleLogout}
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
