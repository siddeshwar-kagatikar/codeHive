import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';
import '../styles/UserHome.css'; // Import the CSS file

export default function UserHome() {
  const navigate = useNavigate();
  const { startTimer } = useContext(TimerContext);

  const handleStartTest = (e) => {
    e.preventDefault();
    startTimer(7200); // 2 hours
    navigate("/addquestion");
  };

  return (
    <div className="user-home-container">
      <div className="background-blur blur1"></div>
      <div className="background-blur blur2"></div>

      <div className="content">
        <h1 className="heading">Ready to Level Up Your Code?</h1>
        <p className="description">
          This challenge will push your logic, creativity, and coding skills. <br />
          <span className="highlight">Take a breath. Trust your skills. Let’s go.</span>
        </p>

        <button className="start-button" onClick={handleStartTest}>
          🚀 Start Test
        </button>
      </div>
    </div>
  );
}
