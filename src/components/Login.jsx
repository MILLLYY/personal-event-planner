// src/components/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import Lottie from "lottie-react";
import animationData from "../assets/LogingreetingAnimation.json";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!credentials.email || !credentials.password) {
        setError("Both fields are required");
        return;
    }

    try {
        const result = await loginUser(credentials.email, credentials.password);

        if (!result.success) {
            setError(result.message);
            return;
        }

        toast.success("Welcome back!");
        setIsLoggedIn(true);

        // ✅ Ensure navigation happens after authentication
        setTimeout(() => {
            navigate("/dashboard");
        }, 1500);
    } catch (error) {
        setError("Login failed. Please try again.");
    }
};

  return (
    <div className="auth-container">
      {isLoggedIn ? (
        <motion.div
          className="login-success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Lottie 
            animationData={animationData} 
            style={{ height: 400, width: 400, margin: "0 auto" }} 
          />
          <h2>Welcome Back!!</h2>
        </motion.div>
      ) : (
        <>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;