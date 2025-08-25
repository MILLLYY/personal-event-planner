import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { EventProvider } from "./context/EventContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import AddEvent from "./components/AddEvent";
import EditEvent from "./components/EditEvent";
import Help from "./components/Help";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// protected Route Component
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <UserProvider>
      <EventProvider>
        <ThemeProvider>
          <Router>
            <Header />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/add-event"
                  element={<ProtectedRoute element={<AddEvent />} />}
                />
                <Route
                  path="/edit-event/:id"
                  element={<ProtectedRoute element={<EditEvent />} />}
                />
                <Route path="/help" element={<Help />} />
              </Routes>
              <ToastContainer position="top-right" autoClose={3000} />
            </div>
            <Footer />
          </Router>
        </ThemeProvider>
      </EventProvider>
    </UserProvider>
  );
}

export default App;
