import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';
import Logout from './Logout';

export default function Navbar() {
  const { timeLeft } = useContext(TimerContext);
  const navigate = useNavigate();

  const formatTime = (time) => {
    if (time === null) return ''; // Timer not running
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    navigate('/login');
    setIsAuthenticated(false); // Update state after logout
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-light">
      <div className="container-fluid">
        <Link className="navbar-brand text-warning" to="/">CodeHive</Link>
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
              <Link className="nav-link active text-light" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="#features">Features</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled text-secondary" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {timeLeft !== null && (
              <div className="me-3 text-light">
                <strong>Time Left: </strong>{formatTime(timeLeft)}
              </div>
            )}
            {!isAuthenticated ? (
              <>
                <Link className="btn btn-warning mx-1" to="/login" role="button">Login</Link>
                <Link className="btn btn-warning mx-1" to="/signup" role="button">SignUp</Link>
              </>
            ) : (
              <Logout handleLogout={handleLogout}/>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
