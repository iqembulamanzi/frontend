import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import all components from the components folder and the Reports page
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Admin from './components/users/Admin';
import Home from './components/incidents/Home';
import Stats from './components/incidents/Stats';
import Chatbot from './components/incidents/Chatbot';
import AssignJob from './components/jobs/AssignJob';

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
          <Link to="/Login" className="nav-link">Login</Link>
          <Link to="/Register" className="nav-link">Register</Link>
        </nav>

        {/* Routing setup */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/assign-job" element={<AssignJob />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
