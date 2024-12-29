import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';

export default function UserHome() {
  const navigate = useNavigate();
  const { startTimer} = useContext(TimerContext);

  const handleStartTest = (e) => {
    e.preventDefault();
    startTimer(30); // Start timer for 2 hours (7200 seconds)
    navigate("/addquestion");
  };


  return (
    <div>
      <button type="button" className="btn btn-warning" onClick={handleStartTest}>
        Start Test
      </button>
      <button type="button" className="btn btn-light">
        Practice
      </button>
    </div>
  );
}
