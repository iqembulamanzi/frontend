import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import all components from the components folder and the Reports page
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
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
      <Header />
      <div className="main-container">
        <h1>Water Pollution Project</h1>

        {/* Routing setup */}
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/assign-job" element={<ProtectedRoute><AssignJob /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
