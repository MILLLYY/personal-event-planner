// src/components/LogoAnimation.jsx
import React from 'react';
import Lottie from 'lottie-react';
import logoAnimation from '../assets/logoAnimation.json'; // Ensure the path and file name are correct

const LogoAnimation = () => {
  return (
    <div style={{ width: 100, height: 100 }}>
      <Lottie animationData={logoAnimation} loop={true} />
    </div>
  );
};

export default LogoAnimation;