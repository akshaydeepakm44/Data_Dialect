import React, { useState, useEffect } from "react";
import "./text.css";
import Nav from "./nav";
import UserFooter from "./userfooter";

const TextPage = () => { // Remove username prop
  const [name, setName] = useState(''); // Initialize with an empty string
  const [category, setCategory] = useState("");
  const [textContent, setTextContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setName(storedUsername);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload

    if (!name || !category || !textContent) {
      setMessage("All fields are required!");
      return;
    }

    const requestData = {
      user_input: textContent,
      category: category,
      name: name, // Sending the name as submitted_by
    };

    try {
      const response = await fetch("http://localhost:5000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(
          `Success! City: ${result.city_town}, District: ${result.predicted_district}, Category: ${result.category}`
        );
        setName("");
        setCategory("");
        setTextContent("");
      } else {
        setMessage("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please check the backend.");
    }
  };

  return (
    <>
      <Nav />
      <div className="text-page">
        <div className="text-card">
          <div className="text-form-section">
            <h2>UPLOAD TEXTUAL DATA</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  readOnly // Make it non-editable
                />
              </label>
              <label>
                Type of Data:
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">-- Select Category --</option>
                  <option value="history">History</option>
                  <option value="culture">Culture</option>
                  <option value="famous-places">Famous Places</option>
                  <option value="food-restaurants">Food and Restaurants</option>
                  <option value="festivals">Festivals and Celebrations</option>
                  <option value="traditional-crops">Traditional Crops</option>
                </select>
              </label>
              <label>
                Text Content:
                <textarea
                  placeholder="Write your content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  required
                ></textarea>
              </label>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
          <div className="text-rules-section">
            <h3>Rules and Constraints</h3>
            <ul>
              <li>Ensure the text is written in clear, formal language.</li>
              <li>Mention place of origin at the beginning.</li>
              <li>Maintain a proper format: use bullet points or numbered lists where necessary.</li>
              <li>Provide accurate and verified information.</li>
              <li>Avoid any offensive or inappropriate content.</li>
            </ul>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
};

export default TextPage;
