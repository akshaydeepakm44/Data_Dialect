import React, { useState, useEffect } from "react";
import "./profile.css";
import Nav from "./nav";
import UserFooter from "./userfooter";
import axios from "axios";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    username: "",
    email: "",
    points: "",
    streak_count: "",
    firstName: "",
    lastName: "",
    organization: "",
    profession: "",
    linkedin: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        console.log("Fetched user_id from localStorage:", userId);

        if (!userId) {
          console.error("User ID not found in localStorage!");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/user/details?user_id=${userId}`
        );

        console.log("API Response:", response.data);

        if (response.data.success && response.data.user) {
          const user = response.data.user;
          setUserDetails({
            id: user.id || "",
            username: user.username || "Not Set",
            email: user.email || "Not Set",
            points: user.points || "0",
            streak_count: user.streak_count || "0",
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            organization: user.organization || "",
            profession: user.profession || "",
            linkedin: user.linkedin || "",
            phone: user.phone || "",
          });
        } else {
          console.error("User data missing in API response!");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.post("http://localhost:5000/user/update-profile", {
        user_id: userDetails.id,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        organization: userDetails.organization,
        profession: userDetails.profession,
        linkedin: userDetails.linkedin,
        phone: userDetails.phone,
      });

      if (response.data.success) {
        alert("Profile updated successfully!");
        setEditMode(false);
        // Fetch updated details
        fetchUserDetails();
      } else {
        alert("Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="profile-page">
      <Nav />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {userDetails.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-cards">
          <div className="profile-card">
            <h2>Personal Details</h2>
            <p>
              <strong>Username:</strong> {userDetails.username}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Points:</strong> {userDetails.points}
            </p>
            <p>
              <strong>Streak Count:</strong> {userDetails.streak_count}
            </p>
            <p>
              <strong>First Name:</strong> {userDetails.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {userDetails.lastName}
            </p>
            <p>
              <strong>Organization:</strong> {userDetails.organization}
            </p>
            <p>
              <strong>Profession:</strong> {userDetails.profession}
            </p>
            <p>
              <strong>LinkedIn:</strong> {userDetails.linkedin}
            </p>
            <p>
              <strong>Phone:</strong> {userDetails.phone}
            </p>
          </div>
          {editMode ? (
            <div className="profile-card">
              <h2>Edit Profile</h2>
              <div className="edit-form">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userDetails.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userDetails.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={userDetails.organization}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={userDetails.profession}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={userDetails.linkedin}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <button className="update-btn" onClick={handleUpdateProfile}>
                  Update Profile
                </button>
              </div>
            </div>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default Profile;
