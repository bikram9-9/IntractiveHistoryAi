import React, { useState } from "react";
import { GameSettings } from "@/types/gametypes";

interface PreGamePromptProps {
  onStart: (settings: GameSettings) => void;
}

const PreGamePrompt: React.FC<PreGamePromptProps> = ({ onStart }) => {
  const [gameMode, setGameMode] = useState<"text" | "multipleChoice">("text");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [timer, setTimer] = useState(30);

  const handleStart = () => {
    onStart({
      gameMode: {
        text: gameMode === "text",
        multipleChoice: gameMode === "multipleChoice",
      },
      difficulty,
      timer,
    });
  };

  return (
    <div className="bg-geo-bg p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-geo-green text-3xl font-bold mb-6 flex justify-center">
        Flag Rush Settings
      </h1>
      <div className="mb-6 flex justify-center space-x-4 text-geo-green">
        <label className="flex items-center">
          <input
            type="radio"
            checked={gameMode === "text"}
            onChange={() => setGameMode("text")}
            className="mr-2"
          />
          Text Input
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={gameMode === "multipleChoice"}
            onChange={() => setGameMode("multipleChoice")}
            className="mr-2"
          />
          Multiple Choice
        </label>
      </div>
      <div className="mb-6 flex justify-center space-x-4">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level as "easy" | "medium" | "hard")}
            className={`px-4 py-2 rounded-md ${
              difficulty === level
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Timer: {timer} seconds
        </label>
        <input
          type="range"
          min="10"
          max="60"
          step="5"
          value={timer}
          onChange={(e) => setTimer(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        onClick={handleStart}
        className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        Start Game
      </button>
    </div>
  );
};

export default PreGamePrompt;
