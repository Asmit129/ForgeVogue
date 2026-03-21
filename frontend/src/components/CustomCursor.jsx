import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering over clickable elements
      if (
        e.target.tagName.toLowerCase() === "button" ||
        e.target.tagName.toLowerCase() === "a" ||
        e.target.closest("button") ||
        e.target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Variants for the outer ring
  const ringVariants = {
    default: {
      x: mousePosition.x - 16, // center 32x32 circle
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: "transparent",
      border: "1px solid rgba(212, 175, 55, 0.5)", // Gold border
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1.5,
      backgroundColor: "rgba(212, 175, 55, 0.1)", // Light gold fill
      border: "1px solid rgba(212, 175, 55, 0.8)",
    },
  };

  // Variants for the inner dot
  const dotVariants = {
    default: {
      x: mousePosition.x - 3, // center 6x6 dot
      y: mousePosition.y - 3,
      scale: 1,
      opacity: 1,
    },
    hover: {
      x: mousePosition.x - 3,
      y: mousePosition.y - 3,
      scale: 0, // hide dot on hover
      opacity: 0,
    },
  };

  // Skip rendering on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null;
  }

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        variants={ringVariants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-exclusion hidden md:block"
      />
      {/* Inner Dot */}
      <motion.div
        variants={dotVariants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--accent-gold)] rounded-full pointer-events-none z-[9999] hidden md:block"
      />
      {/* Soft Spotlight Aura */}
      <motion.div
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[-1] hidden md:block mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0) 70%)"
        }}
      />
    </>
  );
};

export default CustomCursor;
