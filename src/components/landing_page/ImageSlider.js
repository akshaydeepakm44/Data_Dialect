import React, { useState, useEffect } from "react";
import "./ImageSlider.css";

const ImageSlider = ({ images, autoPlay = true, interval = 3000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(handleNextClick, interval);
    return () => clearInterval(timer);
  }, [currentImageIndex, autoPlay, interval]);

  if (images.length === 0) return <p>No images available</p>;

  return (
    <div className="slider-card">
      {/* Image Slider */}
      <div className="image-slider">
        <div className="slider-container">
          {images.map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt={item.name}
              className={index === currentImageIndex ? "active" : ""}
            />
          ))}
        </div>
        {/* Dots */}
        <div className="dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImageIndex ? "active" : ""}`}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Right-side Illustration */}
      <div className="image-placeholder">
        <img
          src={`${process.env.PUBLIC_URL}/undraw_image-viewer_m5ud.svg`}
          alt="Illustration"
          className="illustration"
        />
      </div>
    </div>
  );
};

export default ImageSlider;
