import React from "react";
import './Chatbot.css';

const Chatbot = () => {
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <h2>Chatbot</h2>
        <p>This is where the chatbot functionality will go.</p>
      </div>
      
      <div className="chat-input-container">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="chat-input" 
        />
        <button className="chat-button send-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
        <button className="chat-button audio-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.4-2c0 3.03-2.43 5.5-5.4 5.5S6.6 15.03 6.6 12H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-1.6z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
