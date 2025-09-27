// src/hooks/useInterviewTimer.js
import { useState, useEffect, useRef } from 'react';

export const useInterviewTimer = (duration, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep the callback ref updated without re-triggering the effect
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (duration <= 0) {
      return; // Do nothing if duration is 0
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          onTimeUpRef.current(); // Call the latest callback
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration]);

  return timeLeft;
};