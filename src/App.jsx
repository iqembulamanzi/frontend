import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin';
import Chatbot from './components/Chatbot';
import AssignJob from './components/AssignJob';
import Stats from './components/Stats';
import Home from './components/Home';
import './App.css'; // We'll create this file to reset styles

function App() {
  return (
    <Router>
      {/* Remove any container divs that might have padding/margin */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/assign-job" element={<AssignJob />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;