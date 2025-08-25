// src/components/Header.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import LogoAnimation from "./LogoAnimation";
import { motion } from "framer-motion";
import "./Header.css";

const Header = () => {
  const { user, logoutUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="branding">
          <LogoAnimation />
          <h1>Eventsta</h1>
        </div>
        <nav>
          <ul>
            {user ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/add-event">Add Event</Link>
                </li>
                <li>
                  <Link to="/help">Help</Link>
                </li>
                <li>
                  <button onClick={logoutUser}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            <li>
              <button onClick={toggleTheme}>
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;