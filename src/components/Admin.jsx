import React, { useState } from "react";
import './Admin.css';

const Admin = () => {
  // Placeholder user data
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "Team Lead" },
    { id: 3, name: "Charlie", role: "Field Worker" },
    { id: 4, name: "Dana", role: "Field Worker" },
  ]);

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Field Worker");

  const handleAddUser = (e) => {
    e.preventDefault();
    if (newName) {
      const newUser = {
        id: users.length + 1,
        name: newName,
        role: newRole,
      };
      setUsers([...users, newUser]);
      setNewName("");
      setNewRole("Field Worker");
    }
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, role: newRole } : user
    ));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

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
