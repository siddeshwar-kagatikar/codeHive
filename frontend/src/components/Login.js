import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'; // Make sure to create this

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_type, setUser_type] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://codehive-zgga.onrender.com/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, user_type, password })
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem('token', json.autoken);
      localStorage.setItem('user_type', user_type);
      navigate(user_type === "admin" ? "/addquestion" : "/userhome");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Login to CodeHive</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control login-input"
              id="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control login-input"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-light">
            <label className="form-label me-3">User Type:</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="userType"
                id="adminRadio"
                onClick={() => setUser_type("admin")}
              />
              <label className="form-check-label" htmlFor="adminRadio">Admin</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="userType"
                id="userRadio"
                onClick={() => setUser_type("user")}
              />
              <label className="form-check-label" htmlFor="userRadio">User</label>
            </div>
          </div>
          <button type="submit" className="btn login-btn w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <small className="text-light">
            Don't have an account? <a href="/signup" className="login-link">Sign up</a>
          </small>
        </div>
      </div>
    </div>
  );
}
