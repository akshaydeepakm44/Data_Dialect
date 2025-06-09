import React, { useState } from "react";
import "./user_details.css";
import Navbarr from './navbar1.js';
import Footerr from './footerr.js';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addUser = async () => {
    if (userName && userEmail && password) {
      try {
        const response = await fetch("http://localhost:5000/register/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: userName, email: userEmail, password })
        });
        const data = await response.json();
        if (response.ok) {
          alert("User created successfully");
          setUserName("");
          setUserEmail("");
          setPassword("");
          setShowForm(false);
        } else {
          alert(data.error || "Failed to create user");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    } else {
      alert("Please enter Name, Email, and Password.");
    }
  };

  const searchUser = async () => {
    if (searchQuery) {
      try {
        const response = await fetch(`http://localhost:5000/user/${searchQuery}`);
        const data = await response.json();
        setUsers([data]);
      } catch (error) {
        alert("Error fetching user: " + error.message);
      }
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        alert("User deleted successfully");
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Navbarr />
      <div className="user-details-container">
        <h1>User Details</h1>

        <button className="add-user-button" onClick={() => setShowForm(!showForm)}>
          Add User
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchUser}>Search</button>
        </div>

        {showForm && (
          <div className="form-container">
            <input
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={addUser}>Register User</button>
          </div>
        )}

        <div className="user-list">
          {users.length === 0 && (
            <p>{searchQuery ? "No users found." : "No users available."}</p>
          )}
          {users.length > 0 && (
            <table style={{ border: "1px solid black", width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Username</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Email</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Date Created</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Last Login</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Streak Count</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{user.id}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{user.username}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{user.email}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{user.date_created}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{user.last_login}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{user.streak_count}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footerr />
    </>
  );
}

export default UserDetails;
