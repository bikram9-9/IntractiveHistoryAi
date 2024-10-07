import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const updateTimer = () => {
      const elapsedTime = Math.floor(
        (Date.now() - (startTimeRef.current || 0)) / 1000
      );
      const newTimeLeft = Math.max(0, duration - elapsedTime);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        onComplete();
        return;
      }

      timerRef.current = requestAnimationFrame(updateTimer);
    };

    timerRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [duration, onComplete]);

  return (
    <div className="text-3xl text-geo-green font-bold mb-4">
      Time left: {timeLeft}s
    </div>
  );
};

export default Timer;
