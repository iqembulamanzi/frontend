import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation - replace with actual authentication
    if (credentials.username === 'admin' && credentials.password === 'password') {
      onLogin('admin');
      onClose();
    } else if (credentials.username === 'clerk' && credentials.password === 'password') {
      onLogin('clerk');
      onClose();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Admin/Clerk Login</h2>
        <p>Please enter your credentials to access the system</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-submit-btn">Login</button>
        </form>
        
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p>Admin: username: <strong>admin</strong>, password: <strong>password</strong></p>
          <p>Clerk: username: <strong>clerk</strong>, password: <strong>password</strong></p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;