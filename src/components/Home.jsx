import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./Home.css";

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userType) => {
    setUser(userType);
    // You can redirect or change state based on user type
    console.log(`Logged in as: ${userType}`);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="home-container">
      {/* Header with login/logout button */}
      <header className="home-header">
        <div className="right-links">
          {user ? (
            <button onClick={handleLogout} className="nav-link login-btn">
              Logout ({user})
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)} 
              className="nav-link login-btn"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="home-main">
        <div className="hero-content">
          <h1>Sewer System Monitoring Platform</h1>
          <p>Advanced monitoring and management for urban sewer infrastructure</p>
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Enter incident reference number..."
                className="search-input"
              />
              <button className="search-button">
                <span className="search-icon">🔍</span>
                Locate
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick stats section */}
        <div className="stats-preview">
          <div className="stat-card">
            <h3>1,243</h3>
            <p>Active Monitoring Points</p>
          </div>
          <div className="stat-card">
            <h3>98.2%</h3>
            <p>System Efficiency</p>
          </div>
          <div className="stat-card">
            <h3>24</h3>
            <p>Ongoing Incidents</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <Link to="/about" className="footer-link">About Us</Link>
        <Link to="/chatbot" className="footer-link">Chatbot Support</Link>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Home;