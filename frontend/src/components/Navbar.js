import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';
import Logout from './Logout';
import '../styles/Navbar.css'; // New CSS file

export default function Navbar() {
  const { timeLeft } = useContext(TimerContext);
  const navigate = useNavigate();

  const formatTime = (time) => {
    if (time === null) return '';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand brand-glow" to="/">CodeHive</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">Home</Link>
            </li>
            {localStorage.getItem('token') && <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/addquestion">Question</Link>
            </li>}
           
          </ul>
          <div className="d-flex align-items-center gap-3">
            {timeLeft !== null && (
              <div className="timer-box">
                ⏱ {formatTime(timeLeft)}
              </div>
            )}
            {!localStorage.getItem('token')? (
              <>
                <Link className="btn nav-btn" to="/login">Login</Link>
                <Link className="btn nav-btn" to="/signup">SignUp</Link>
              </>
            ) : (
              <Logout handleLogout={handleLogout} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
