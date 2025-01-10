import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // Import the Axios instance

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/users/login", formData);
      const { token } = response.data;
      localStorage.setItem("authToken", token); // Store token in localStorage
      navigate("/home"); // Redirect to Home Page on success
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.response?.data?.error || "Invalid email or password.");
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Not have an account?{" "}
        <button className="signup-link" onClick={handleSignUpRedirect}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
