import React, { useState, useEffect } from "react";
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard data");

        setStats(data.stats); // Expecting: [{ title: "Active Reports", value: 12 }, ...]
        setRecentActivity(data.recentActivity); // Expecting: [{ id: 1, type: "Report", description: "..." }, ...]
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

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
        {recentActivity.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul className="activity-list">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="activity-item">
                <span className={`activity-type ${activity.type.toLowerCase()}`}>
                  {activity.type}
                </span>
                <span className="activity-description">{activity.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
