import React from "react";
import "./footerr.css";
// Ensure the correct path to your logo

const Footerr = () => {
  const year = new Date().getFullYear();

  return (
    <div className="footerr">
      <img src="/logo.png" alt="Logo" className="logo-img" />
      <p>All rights reserved @ {year} Data Dialect</p>
    </div>
  );
};

export default Footerr;
