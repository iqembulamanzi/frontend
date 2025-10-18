import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="main-nav">
      <div className="nav-left">
        <div className="nav-logo">🌊 WaterGuard</div>
      </div>
      {isLoggedIn && (
        <>
          <div className={`nav-center ${isMenuOpen ? 'show' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            <Link to="/chatbot" className="nav-link" onClick={() => setIsMenuOpen(false)}>REPORT</Link>
            <Link to="/assign-job" className="nav-link" onClick={() => setIsMenuOpen(false)}>Assign Job</Link>
            <Link to="/stats" className="nav-link" onClick={() => setIsMenuOpen(false)}>Stats</Link>
            <div className="mobile-profile-section">
              <button className="mobile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </>
      )}
      <div className="nav-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <div className="profile-dropdown">
            <div className="profile-icon" onClick={toggleDropdown}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            {showDropdown && (
              <div className="dropdown-content show">
                <div className="user-info">
                  <h4>{user?.name || 'User'}</h4>
                  <p>{user?.email || ''}</p>
                  <p>Role: {user?.role || 'User'}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;