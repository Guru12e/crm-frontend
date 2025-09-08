"use client";

import { motion } from "motion/react";
import { useState } from "react";

const circleVariants = {
  normal: {
    cx: 8,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  animate: {
    cx: 16,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

const ToggleLeft = ({
  width = 100,
  height = 100,
  strokeWidth = 2,
  isDarkMode = false,
  ...props
}) => {
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);

  const strokeColor = isDarkMode ? "#000000" : "#ffffff";

  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
      }}
      onClick={toggleSwitch}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
        <motion.circle
          cy="12"
          r="2"
          variants={circleVariants}
          animate={isOn ? "animate" : "normal"}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { ToggleLeft };
