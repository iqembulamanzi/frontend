import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Admin details
  const adminDetails = {
    name: "Admin User",
    staffNumber: "ADM-2024-001",
    role: "System Administrator",
    department: "Infrastructure Management",
    lastLogin: new Date().toLocaleDateString()
  };

  // Team members available for assignment
  const [teamMembers] = useState([
    { id: 1, name: "Mike Johnson", role: "Field Technician", status: "Available", avatar: "MJ", tasks: 2 },
    { id: 2, name: "Sarah Wilson", role: "Senior Technician", status: "On Site", avatar: "SW", tasks: 3 },
    { id: 3, name: "David Brown", role: "Maintenance Engineer", status: "Available", avatar: "DB", tasks: 1 },
    { id: 4, name: "Lisa Garcia", role: "Field Technician", status: "On Break", avatar: "LG", tasks: 0 },
    { id: 5, name: "James Miller", role: "Emergency Response", status: "Available", avatar: "JM", tasks: 2 }
  ]);

  // Mock data with assignment functionality
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalUsers: 1,
      activeIncidents: 24,
      systemUptime: "99.8%",
      monitoringPoints: 1243,
      assignedIncidents: 18,
      responseTime: "2.3h"
    },
    recentActivity: [
      { id: 1, action: "New incident reported", location: "Main St", time: "2 mins ago", type: "incident", priority: "high" },
      { id: 2, action: "User registered", user: "john@example.com", time: "5 mins ago", type: "user" },
      { id: 3, action: "Technician assigned", incident: "INC-001", technician: "Mike Johnson", time: "10 mins ago", type: "assignment" },
      { id: 4, action: "System backup completed", time: "1 hour ago", type: "system" },
      { id: 5, action: "Incident resolved", incident: "INC-005", location: "Central Park", time: "2 hours ago", type: "resolution", priority: "medium" }
    ],
    incidents: [
      { 
        id: 1, 
        incidentId: "INC-001",
        location: "Main St", 
        status: "Assigned", 
        priority: "High", 
        reported: "2 hours ago",
        description: "Severe blockage causing overflow in main sewer line",
        assignedTo: "Mike Johnson",
        assignedTime: "1 hour ago",
        estimatedResolution: "Today, 16:00",
        area: "Downtown",
        severity: "Critical"
      },
      { 
        id: 2, 
        incidentId: "INC-002",
        location: "Oak Avenue", 
        status: "Resolved", 
        priority: "Medium", 
        reported: "1 day ago",
        description: "Minor leak detected in residential area",
        assignedTo: "Sarah Wilson",
        assignedTime: "1 day ago",
        resolvedTime: "Today, 09:30",
        area: "Residential",
        severity: "Moderate"
      },
      { 
        id: 3, 
        incidentId: "INC-003",
        location: "Pine Road", 
        status: "Investigating", 
        priority: "Low", 
        reported: "3 hours ago",
        description: "Routine maintenance check and inspection",
        assignedTo: null,
        assignedTime: null,
        estimatedResolution: "Today, 15:00",
        area: "Industrial",
        severity: "Low"
      },
      { 
        id: 4, 
        incidentId: "INC-004",
        location: "Elm Street", 
        status: "Active", 
        priority: "High", 
        reported: "45 mins ago",
        description: "Pump failure - urgent attention required",
        assignedTo: null,
        assignedTime: null,
        estimatedResolution: "ASAP",
        area: "Commercial",
        severity: "Critical"
      },
      { 
        id: 5, 
        incidentId: "INC-005",
        location: "River View", 
        status: "In Progress", 
        priority: "Medium", 
        reported: "5 hours ago",
        description: "Water pressure fluctuation in distribution system",
        assignedTo: "James Miller",
        assignedTime: "4 hours ago",
        estimatedResolution: "Today, 18:00",
        area: "Suburban",
        severity: "Moderate"
      }
    ]
  });

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle incident assignment
  const handleAssignIncident = (incident) => {
    setSelectedIncident(incident);
    setShowAssignmentModal(true);
  };

  const handleAssignToTechnician = (technician) => {
    if (selectedIncident) {
      const updatedIncidents = dashboardData.incidents.map(incident => 
        incident.id === selectedIncident.id 
          ? { 
              ...incident, 
              assignedTo: technician.name,
              assignedTime: "Just now",
              status: "Assigned"
            }
          : incident
      );

      setDashboardData(prev => ({
        ...prev,
        incidents: updatedIncidents,
        recentActivity: [
          {
            id: Date.now(),
            action: "Technician assigned",
            incident: selectedIncident.incidentId,
            technician: technician.name,
            time: "Just now",
            type: "assignment"
          },
          ...prev.recentActivity
        ]
      }));

      setShowAssignmentModal(false);
      setSelectedIncident(null);
    }
  };

  const handleUpdateIncidentStatus = (incidentId, newStatus) => {
    const updatedIncidents = dashboardData.incidents.map(incident => 
      incident.id === incidentId 
        ? { 
            ...incident, 
            status: newStatus,
            ...(newStatus === "Resolved" && { resolvedTime: new Date().toLocaleString() })
          }
        : incident
    );

    setDashboardData(prev => ({
      ...prev,
      incidents: updatedIncidents
    }));
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="welcome-text">
          <h1>Welcome back, {adminDetails.name} 👋</h1>
          <p>Here's what's happening with your sewer system today</p>
        </div>
        <div className="current-time">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{dashboardData.overview.activeIncidents}</h3>
            <p>Active Incidents</p>
            <span className="trend down">-5% from yesterday</span>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{dashboardData.overview.assignedIncidents}</h3>
            <p>Assigned Incidents</p>
            <span className="trend up">+8% efficiency</span>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{dashboardData.overview.responseTime}</h3>
            <p>Avg Response Time</p>
            <span className="trend down">-12% faster</span>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">📡</div>
          <div className="stat-content">
            <h3>{dashboardData.overview.monitoringPoints}</h3>
            <p>Monitoring Points</p>
            <span className="trend up">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Recent Incidents */}
        <div className="grid-card incidents-preview">
          <div className="card-header">
            <h3>Recent Incidents</h3>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="incidents-list">
            {dashboardData.incidents.slice(0, 4).map(incident => (
              <div key={incident.id} className="incident-preview-card">
                <div className="incident-priority">
                  <div className={`priority-dot priority-${incident.priority.toLowerCase()}`}></div>
                </div>
                <div className="incident-details">
                  <h4>{incident.incidentId}</h4>
                  <p>{incident.location}</p>
                  <span className="incident-area">{incident.area}</span>
                </div>
                <div className="incident-status">
                  <span className={`status-tag status-${incident.status.toLowerCase().replace(' ', '-')}`}>
                    {incident.status}
                  </span>
                  <span className="incident-time">{incident.reported}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid-card team-overview">
          <div className="card-header">
            <h3>Team Overview</h3>
            <span className="online-count">{teamMembers.filter(m => m.status === 'Available').length} online</span>
          </div>
          <div className="team-grid-compact">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member-compact">
                <div className="member-avatar-status">
                  <div className="member-avatar">
                    {member.avatar}
                  </div>
                  <div className={`online-status ${member.status === 'Available' ? 'online' : member.status === 'On Site' ? 'busy' : 'away'}`}></div>
                </div>
                <div className="member-details-compact">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>
                <div className="member-tasks">
                  <span className="task-count">{member.tasks}</span>
                  <span className="task-label">tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid-card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="action-grid">
            <button className="action-card primary">
              <span className="action-icon">➕</span>
              <span className="action-text">New Incident</span>
            </button>
            <button className="action-card secondary">
              <span className="action-icon">📊</span>
              <span className="action-text">Generate Report</span>
            </button>
            <button className="action-card warning">
              <span className="action-icon">👥</span>
              <span className="action-text">Manage Team</span>
            </button>
            <button className="action-card danger">
              <span className="action-icon">⚙️</span>
              <span className="action-text">System Settings</span>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid-card activity-feed">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-timeline">
            {dashboardData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item-enhanced">
                <div className={`activity-icon-enhanced ${activity.type}`}>
                  {activity.type === 'incident' && '🚨'}
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'assignment' && '✅'}
                  {activity.type === 'system' && '⚙️'}
                  {activity.type === 'resolution' && '🎉'}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.action}</p>
                  <div className="activity-meta">
                    {activity.location && <span className="activity-location">📍 {activity.location}</span>}
                    {activity.incident && <span className="activity-incident">#{activity.incident}</span>}
                    {activity.technician && <span className="activity-technician">👨‍💼 {activity.technician}</span>}
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncidentsSection = () => (
    <div className="incidents-section-enhanced">
      {/* Header with Stats */}
      <div className="incidents-header">
        <div className="header-content">
          <h1>Incident Management</h1>
          <p>Monitor and manage all sewer system incidents in real-time</p>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-number">{dashboardData.incidents.length}</span>
            <span className="stat-label">Total Incidents</span>
          </div>
          <div className="header-stat">
            <span className="stat-number">{dashboardData.incidents.filter(i => i.status === 'Active').length}</span>
            <span className="stat-label">Require Attention</span>
          </div>
          <div className="header-stat">
            <span className="stat-number">{dashboardData.incidents.filter(i => i.priority === 'High').length}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="action-group">
          <button className="btn-primary">
            <span className="btn-icon">➕</span>
            Report New Incident
          </button>
          <button className="btn-secondary">
            <span className="btn-icon">📋</span>
            Bulk Actions
          </button>
        </div>
        <div className="filter-group">
          <select className="filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Assigned</option>
            <option>Resolved</option>
          </select>
          <select className="filter-select">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search incidents..." className="search-input" />
          </div>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="incidents-grid">
        {dashboardData.incidents.map(incident => (
          <div key={incident.id} className={`incident-card priority-${incident.priority.toLowerCase()}`}>
            <div className="incident-card-header">
              <div className="incident-id-priority">
                <h3>{incident.incidentId}</h3>
                <div className={`priority-badge-enhanced priority-${incident.priority.toLowerCase()}`}>
                  {incident.priority} Priority
                </div>
              </div>
              <div className="incident-actions-compact">
                <button className="icon-btn" title="View Details">👁️</button>
                <button className="icon-btn" title="Edit">✏️</button>
                <button className="icon-btn" title="History">📋</button>
              </div>
            </div>
            
            <div className="incident-card-body">
              <div className="incident-location">
                <span className="location-icon">📍</span>
                <div>
                  <h4>{incident.location}</h4>
                  <span className="area-badge">{incident.area}</span>
                </div>
              </div>
              
              <p className="incident-description">{incident.description}</p>
              
              <div className="incident-meta">
                <div className="meta-item">
                  <span className="meta-label">Reported</span>
                  <span className="meta-value">{incident.reported}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Severity</span>
                  <span className={`meta-value severity-${incident.severity.toLowerCase()}`}>
                    {incident.severity}
                  </span>
                </div>
              </div>
            </div>

            <div className="incident-card-footer">
              <div className="status-section">
                <select 
                  value={incident.status}
                  onChange={(e) => handleUpdateIncidentStatus(incident.id, e.target.value)}
                  className={`status-select-enhanced status-${incident.status.toLowerCase().replace(' ', '-')}`}
                >
                  <option value="Active">🟡 Active</option>
                  <option value="Assigned">🔵 Assigned</option>
                  <option value="Investigating">🟠 Investigating</option>
                  <option value="In Progress">🟣 In Progress</option>
                  <option value="Resolved">🟢 Resolved</option>
                </select>
              </div>
              
              <div className="assignment-section">
                {incident.assignedTo ? (
                  <div className="assigned-info">
                    <div className="assigned-avatar">
                      {incident.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="assigned-details">
                      <span className="assigned-to">{incident.assignedTo}</span>
                      <span className="assigned-time">{incident.assignedTime}</span>
                    </div>
                    <button 
                      className="unassign-btn-circle"
                      onClick={() => handleUpdateIncidentStatus(incident.id, 'Active')}
                      title="Unassign"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button 
                    className="assign-btn-enhanced"
                    onClick={() => handleAssignIncident(incident)}
                  >
                    <span className="assign-icon">👨‍💼</span>
                    Assign Technician
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="modal-overlay-enhanced">
          <div className="assignment-modal-enhanced">
            <div className="modal-header-enhanced">
              <h2>Assign Technician</h2>
              <p>Select a team member to handle this incident</p>
              <button 
                className="close-btn-enhanced"
                onClick={() => setShowAssignmentModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content-enhanced">
              <div className="incident-preview-modal">
                <div className="incident-preview-header">
                  <h3>{selectedIncident?.incidentId}</h3>
                  <div className={`priority-badge-modal priority-${selectedIncident?.priority.toLowerCase()}`}>
                    {selectedIncident?.priority} Priority
                  </div>
                </div>
                <div className="incident-preview-details">
                  <p><strong>Location:</strong> {selectedIncident?.location}</p>
                  <p><strong>Description:</strong> {selectedIncident?.description}</p>
                  <p><strong>Severity:</strong> <span className={`severity-badge severity-${selectedIncident?.severity.toLowerCase()}`}>{selectedIncident?.severity}</span></p>
                </div>
              </div>

              <div className="technicians-grid-modal">
                <h4>Available Team Members</h4>
                <div className="technicians-list-modal">
                  {teamMembers.map(technician => (
                    <div 
                      key={technician.id}
                      className="technician-card-modal"
                      onClick={() => handleAssignToTechnician(technician)}
                    >
                      <div className="technician-header-modal">
                        <div className="technician-avatar-modal">
                          {technician.avatar}
                          <div className={`availability-dot ${technician.status === 'Available' ? 'available' : 'busy'}`}></div>
                        </div>
                        <div className="technician-info-modal">
                          <h4>{technician.name}</h4>
                          <p>{technician.role}</p>
                        </div>
                        <div className="workload-indicator">
                          <div className={`workload-bar ${technician.tasks < 2 ? 'low' : technician.tasks < 4 ? 'medium' : 'high'}`}>
                            <div className="workload-fill"></div>
                          </div>
                          <span className="workload-text">{technician.tasks} tasks</span>
                        </div>
                      </div>
                      <div className="technician-status-modal">
                        <span className={`status-tag-modal ${technician.status.toLowerCase().replace(' ', '-')}`}>
                          {technician.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSection = () => {
    switch(activeSection) {
      case "dashboard":
        return renderDashboard();
      case "incidents":
        return renderIncidentsSection();
      case "users":
        return <div className="section-placeholder"><h2>User Management</h2><p>User administration panel</p></div>;
      case "reports":
        return <div className="section-placeholder"><h2>Report Management</h2><p>Report generation and analytics</p></div>;
      case "settings":
        return <div className="section-placeholder"><h2>System Settings</h2><p>Configuration and preferences</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-container-enhanced">
      <header className="admin-header-enhanced">
        <div className="admin-brand">
          <h1>🚰 SewerWatch Admin</h1>
        </div>
        
        <div className="admin-profile-enhanced">
          <div className="admin-info-enhanced">
            <div className="admin-avatar">
              {adminDetails.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="admin-details-enhanced">
              <div className="admin-name">{adminDetails.name}</div>
              <div className="admin-meta">
                <span className="staff-id">{adminDetails.staffNumber}</span>
                <span className="admin-role">{adminDetails.role}</span>
              </div>
            </div>
          </div>
          <div className="admin-actions-enhanced">
            <Link to="/" className="nav-link-home">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="admin-content-enhanced">
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar-enhanced">
          <nav className="admin-nav-enhanced">
            <button 
              className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveSection("dashboard")}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Dashboard</span>
            </button>
            <button 
              className={`nav-item ${activeSection === "incidents" ? "active" : ""}`}
              onClick={() => setActiveSection("incidents")}
            >
              <span className="nav-icon">🚨</span>
              <span className="nav-label">Incidents</span>
              <span className="nav-badge">{dashboardData.incidents.filter(i => i.status === 'Active').length}</span>
            </button>
            <button 
              className={`nav-item ${activeSection === "users" ? "active" : ""}`}
              onClick={() => setActiveSection("users")}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Team</span>
            </button>
            <button 
              className={`nav-item ${activeSection === "reports" ? "active" : ""}`}
              onClick={() => setActiveSection("reports")}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-label">Reports</span>
            </button>
            <button 
              className={`nav-item ${activeSection === "settings" ? "active" : ""}`}
              onClick={() => setActiveSection("settings")}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Settings</span>
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <div className="system-status">
              <div className="status-indicator online"></div>
              <span>All Systems Operational</span>
            </div>
          </div>
        </aside>

        <main className="admin-main-enhanced">
          <div className="admin-content-area-enhanced">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;