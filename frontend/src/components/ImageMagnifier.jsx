import React, { useState } from "react";

const ImageMagnifier = ({ src, alt, className = "" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseOver = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden cursor-crosshair ${className}`}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseOver}
    >
      <img
        src={src}
        alt={alt || "Product image"}
        className={`w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform ${
          showMagnifier ? "scale-150" : "scale-100"
        }`}
        style={{
          transformOrigin: showMagnifier ? `${position.x}% ${position.y}%` : "center center",
        }}
      />
    </div>
  );
};

export default ImageMagnifier;
