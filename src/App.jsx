import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import all components from the components folder and the Reports page
import Admin from './components/Admin';
import Chatbot from './components/Chatbot';
import AssignJob from './components/AssignJob';
import Stats from './components/Stats';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="main-container">
        <h1>Water Pollution Project</h1>
        
        {/* Navigation */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
          <Link to="/chatbot" className="nav-link">Chatbot</Link>
          <Link to="/assign-job" className="nav-link">Assign Job</Link>
          <Link to="/stats" className="nav-link">Stats</Link>
        </nav>

        {/* Routing setup */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/assign-job" element={<AssignJob />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
