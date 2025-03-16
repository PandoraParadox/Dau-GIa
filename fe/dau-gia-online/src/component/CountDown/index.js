import React, { useState, useEffect } from "react";

const CountdownTimer = ({ initialTime , setCheckTime }) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  // Hàm định dạng thời gian thành "HH:mm:ss"
  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (remainingTime <= 0) setCheckTime(true);

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  return <h4>{formatTime(remainingTime)}</h4>;
};

export default CountdownTimer;
