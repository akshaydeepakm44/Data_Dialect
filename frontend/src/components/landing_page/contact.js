import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./contact.css"; // Import the CSS file

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_f0yge8j", // Replace with your EmailJS service ID
        "template_4a902v8", // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.purpose,
        },
        "cwBFeRJB3MObC-dRD" // Replace with your EmailJS public key
      )
      .then(() => {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", purpose: "" });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Failed to send message.");
      });
  };

  return (
    <div className="contact-container" id="connect">
        <h2>ｃｏｎｎｅｃｔ</h2>
      <div className="contact-card">
        {/* Left Side - Image */}
        
          <img
            src="/connect.svg"
            alt="Connect with us"
            className="image"
          />
        

        {/* Right Side - Contact Form */}
        <div className="contact-form">
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
            <textarea
              name="purpose"
              placeholder="Describe your purpose to connect and we will contact you?"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="input-field"
            ></textarea>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
