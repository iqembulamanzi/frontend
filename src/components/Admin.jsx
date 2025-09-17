import React, { useState, useEffect } from "react";
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Field Worker");

  const token = localStorage.getItem("token");

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch users");
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add user");
      setUsers([...users, data.user]);
      setNewName("");
      setNewRole("Field Worker");
    } catch (err) {
      setError(err.message);
    }
  };

  // Update role
  const handleRoleChange = async (id, role) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setUsers(users.map(u => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-container">
      <h2>User Management</h2>

      <div className="admin-form-section">
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser} className="admin-form">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new user's name"
            required
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Field Worker">Field Worker</option>
          </select>
          <button type="submit" className="add-user-btn">Add User</button>
        </form>
      </div>

      <div className="user-list-section">
        <h3>Current Users</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Field Worker">Field Worker</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-user-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
