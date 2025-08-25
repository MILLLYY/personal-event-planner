
// src/components/RegistrationGreeting.jsx
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { UserContext } from "../context/UserContext";
// Replace with your specific registration greeting animation JSON file
import registrationGreetingAnimation from "../assets/greetingAnimation.json";
import "./Greeting.css"

const RegistrationGreeting = () => {
  const { user } = useContext(UserContext);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) return null;

  return (
    <motion.div
      className="greeting-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="animation-wrapper">
        <Lottie
          animationData={registrationGreetingAnimation}
          loop={false}
          style={{ width: 200, height: 200 }}
        />
      </div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Welcome, {user?.name}! We’re here to help you get started.
      </motion.h2>
    </motion.div>
  );
};

export default RegistrationGreeting;