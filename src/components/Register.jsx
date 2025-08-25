// src/components/Register.jsx
import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import animationData from "../assets/greetingAnimation";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

// define validation schema with yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password too short")
    .required("Password is required"),
});

const Register = () => {
  const { registerUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="auth-container">
      {isRegistered ? (
        <motion.div
          className="register-success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Lottie
            animationData={animationData}
            style={{ height: 400, width: 400, margin: "0 auto" }}
          />
          <h2>Welcome!</h2>
          <p>Registration successful.</p>
        </motion.div>
      ) : (
        <>
          <h2>Register</h2>
          {error && <p className="error">{error}</p>}
          <Formik
            initialValues={{ name: "", email: "", password: "" }} // ✅ Removed username
            validationSchema={RegisterSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                //call firebase authentication and wait for response
                const result = await registerUser(
                  values.email,
                  values.password
                );

                if (!result.success) {
                  setError(result.message);
                  return;
                }

                toast.success("Registration successful! Welcome aboard!");
                setIsRegistered(true);
                resetForm();

                //delay navigation to allow animation to be appreciated
                setTimeout(() => {
                  navigate("/help", { state: { showGreeting: true } });
                }, 1500);
              } catch (error) {
                setError("Registration failed. Please try again.");
              }

              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field type="text" name="name" placeholder="Full Name" />
                <ErrorMessage name="name" component="div" className="error" />

                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage name="email" component="div" className="error" />

                {}

                <Field type="password" name="password" placeholder="Password" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />

                <button type="submit" disabled={isSubmitting}>
                  Register
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default Register;
