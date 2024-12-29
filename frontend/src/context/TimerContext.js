import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

const TimerContext = createContext();

const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(null);
//   const navigate = useNavigate();

  const startTimer = (duration) => {
    setTimeLeft(duration);
  };

  useEffect(() => {
    let timerInterval;

    if (timeLeft !== null) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timerInterval);
            // navigate('/userhome'); // Navigate back to UserHome.js
            return null; // Reset the timer
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [timeLeft]);

  return (
    <TimerContext.Provider value={{ timeLeft, startTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export { TimerProvider };
export default TimerContext;
