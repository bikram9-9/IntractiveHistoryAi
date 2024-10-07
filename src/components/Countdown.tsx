import React, { useState, useEffect } from "react";

interface CountdownProps {
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const audio = new Audio("/sounds/beep.mp3"); // Make sure to add this sound file to your public folder

    if (count > 0) {
      audio.play();
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      audio.src = "/sounds/start.mp3"; // A different sound for when the countdown ends
      audio.play();
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="text-9xl font-bold text-white animate-pulse">
        {count > 0 ? count : "GO!"}
      </div>
    </div>
  );
};

export default Countdown;
