import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css"; // We'll create this CSS file

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate fetching data
    setIncidents([
      { id: 1, location: "Main St", status: "Active", priority: "High", reported: "2023-04-15" },
      { id: 2, location: "Oak Ave", status: "Resolved", priority: "Medium", reported: "2023-04-10" },
      { id: 3, location: "Pine Rd", status: "Investigating", priority: "Low", reported: "2023-04-18" },
    ]);

    setUsers([
      { id: 1, name: "John Doe", email: "john@example.com", role: "Operator", lastLogin: "2023-04-20" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Viewer", lastLogin: "2023-04-19" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Admin", lastLogin: "2023-04-21" },
    ]);

    setReports([
      { id: 1, title: "Monthly Performance", generated: "2023-04-01", downloads: 42 },
      { id: 2, title: "Incident Summary", generated: "2023-04-15", downloads: 28 },
      { id: 3, title: "System Health", generated: "2023-04-10", downloads: 35 },
    ]);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <h3>{incidents.length}</h3>
                <p>Total Incidents</p>
              </div>
              <div className="admin-stat-card">
                <h3>{users.length}</h3>
                <p>System Users</p>
              </div>
              <div className="admin-stat-card">
                <h3>{reports.length}</h3>
                <p>Generated Reports</p>
              </div>
            </div>
          </div>
        );
      case "incidents":
        return (
          <div className="admin-incidents">
            <h2>Incident Management</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(incident => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.location}</td>
                    <td>
                      <span className={`status-badge status-${incident.status.toLowerCase()}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${incident.priority.toLowerCase()}`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td>{incident.reported}</td>
                    <td>
                      <button className="action-btn view-btn">View</button>
                      <button className="action-btn edit-btn">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "users":
        return (
          <div className="admin-users">
            <h2>User Management</h2>
            <button className="add-user-btn">Add New User</button>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <button className="action-btn edit-btn">Edit</button>
                      <button className="action-btn delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "reports":
        return (
          <div className="admin-reports">
            <h2>Report Management</h2>
            <button className="generate-report-btn">Generate New Report</button>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Generated</th>
                  <th>Downloads</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.title}</td>
                    <td>{report.generated}</td>
                    <td>{report.downloads}</td>
                    <td>
                      <button className="action-btn download-btn">Download</button>
                      <button className="action-btn delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Sewer System Admin Panel</h1>
        <div className="admin-header-actions">
          <span>Welcome, {user}</span>
          <Link to="/" className="nav-link">Back to Home</Link>
        </div>
      </header>

      <div className="admin-content">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`admin-nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === "incidents" ? "active" : ""}`}
              onClick={() => setActiveTab("incidents")}
            >
              Incidents
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;