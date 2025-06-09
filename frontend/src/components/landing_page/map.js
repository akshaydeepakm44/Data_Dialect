import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./map.css";
import Footer from "./footer.js";
import Nav from "./navbar.js";

const ExploreAndhra = () => {
  const navigate = useNavigate();
  const svgObjectRef = useRef(null);

  useEffect(() => {
    const attachDistrictClickHandlers = () => {
      const svgObject = svgObjectRef.current;
      if (svgObject && svgObject.contentDocument) {
        const svgDoc = svgObject.contentDocument;
        const districts = svgDoc.querySelectorAll(".district");

        districts.forEach((district) => {
          district.style.cursor = "pointer";
          district.addEventListener("click", () => {
            const districtName = district.getAttribute("data-name");
            if (districtName) {
              navigate(`/district/${districtName}`);
            }
          });
        });
      }
    };

    const handleSvgLoad = () => {
      setTimeout(attachDistrictClickHandlers, 500);
    };

    if (svgObjectRef.current) {
      svgObjectRef.current.addEventListener("load", handleSvgLoad);
    }

    return () => {
      if (svgObjectRef.current) {
        svgObjectRef.current.removeEventListener("load", handleSvgLoad);
      }
    };
  }, [navigate]);

  return (
    <>
      <Nav />
      <div className="explore-container">
        <header className="explore-header">
          <h1 className="explore-heading">Explore Andhra</h1>
          <p className="explore-message">Click on a district to explore its details</p>
        </header>
        <div className="svg-container">
          <object
            ref={svgObjectRef}
            id="andhra-map"
            type="image/svg+xml"
            data="map.svg"
            className="andhra-map"
            aria-label="Interactive Andhra Map"
          >
            Your browser does not support interactive SVGs.
          </object>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExploreAndhra;
