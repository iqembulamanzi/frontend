import React, { useState } from "react";
import './Home.css';

const Home = () => {
  // Placeholder data for demonstration
  const [stats, setStats] = useState([
    { title: "Active Reports", value: 12 },
    { title: "Jobs Assigned", value: 5 },
    { title: "Teams Active", value: 8 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "Report", description: "New oil spill report in Sector 6." },
    { id: 2, type: "Job", description: "Cleanup assigned to Team Beta." },
    { id: 3, type: "Report", description: "Suspicious water sample near River A." },
    { id: 4, type: "Job", description: "Inspection task for Team Alpha." },
  ]);

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h2>Welcome to the Water Pollution Project Dashboard</h2>
        <p>Your central hub for monitoring, reporting, and managing water pollution data.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-title">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="recent-activity-section">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          {recentActivity.map((activity) => (
            <li key={activity.id} className="activity-item">
              <span className={`activity-type ${activity.type.toLowerCase()}`}>{activity.type}</span>
              <span className="activity-description">{activity.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;