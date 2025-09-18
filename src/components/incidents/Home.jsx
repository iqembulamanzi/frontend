import React, { useState, useEffect } from "react";
import '../Home.css';

const Home = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch incidents
        const incidentsRes = await fetch('/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const incidentsData = await incidentsRes.json();
        if (!incidentsRes.ok) throw new Error(incidentsData.message || "Failed to fetch incidents");

        // Fetch users
        const usersRes = await fetch('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        if (!usersRes.ok) throw new Error(usersData.message || "Failed to fetch users");

        // Compute stats
        const activeReports = incidentsData.filter(inc => inc.status !== 'closed').length;
        const totalUsers = usersData.length;
        const managers = usersData.filter(u => u.role === 'Manager').length;

        setStats([
          { title: "Active Reports", value: activeReports },
          { title: "Total Users", value: totalUsers },
          { title: "Managers", value: managers },
        ]);

        // Recent activity: last 5 incidents
        const recentIncidents = incidentsData.slice(-5).map(inc => ({
          id: inc._id,
          type: "Incident",
          description: `${inc.category} reported - ${inc.status}`,
        }));
        setRecentActivity(recentIncidents);
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