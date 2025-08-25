// src/components/EventSuccessAnimation.jsx
import React from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import successAnimation from "../assets/successAnimation.json"; 
import "./EventSuccessAnimation.css"

const EventSuccessAnimation = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="event-success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Lottie animationData={successAnimation} loop={false} style={{ width: 200, height: 200 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventSuccessAnimation;