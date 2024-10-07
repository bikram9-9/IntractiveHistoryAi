import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import PreGamePrompt from "../../components/PreGamePrompt";
import Countdown from "../../components/Countdown";
import { LeaderBoardEntry, Country } from "@/types/gametypes";
import LeaderBoard from "@/components/LeaderBoard";
import Timer from "@/components/Timer";
import { GameSettings } from "@/types/gametypes";
import { useRouter } from "next/router";
import ExitConfirmationModal from "@/components/ExitConfirmationModal";

interface CountryCode {
  name: string;
  code: string;
}

const FlagRushGame: React.FC = () => {
  const router = useRouter();
  const [showPreGamePrompt, setShowPreGamePrompt] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [currentFlag, setCurrentFlag] = useState<string>("");
  const [currentCountry, setCurrentCountry] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [countries, setcountries] = useState<CountryCode[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderBoardEntry[]>([]);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    fetchcountries();
  }, []);

  useEffect(() => {
    if (gameSettings && countries.length > 0) {
      fetchRandomFlag();
    }
  }, [gameSettings, countries]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (gameStarted && !showExitConfirmation) {
        router.events.emit("routeChangeError");
        setShowExitConfirmation(true);
        setPendingNavigation(url);
        throw "routeChange aborted.";
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [gameStarted, showExitConfirmation, router]);

  const fetchcountries = async () => {
    try {
      const response = await fetch("/data/countries.json");
      const data = await response.json();
      setcountries(data);
    } catch (error) {
      console.error("Error fetching country codes:", error);
    }
  };

  const handleGameStart = (settings: GameSettings) => {
    setGameSettings(settings);
    setShowPreGamePrompt(false);
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameStarted(true);
    setScore(0);
    setTimer(gameSettings?.timer || 30);
  };

  const handleTimerComplete = () => {
    setGameOver(true);
    setGameStarted(false);
  };

  const handleExit = () => {
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    } else {
      router.push("/"); // Default to home page if no pending navigation
    }
  };

  const cancelExit = () => {
    setShowExitConfirmation(false);
    setPendingNavigation(null);
  };

  const fetchRandomFlag = async () => {
    if (countries.length === 0) return;

    const filteredCountries: CountryCode[] = countries.filter(
      (c) => (c as Country).difficultyScore === gameSettings?.difficulty
    );
    const randomCountry =
      filteredCountries[Math.floor(Math.random() * filteredCountries.length)];
    setCurrentCountry(randomCountry.name);

    try {
      const response = await fetch(
        `/api/flags?country=${encodeURIComponent(
          randomCountry.name
        )}&difficulty=${gameSettings?.difficulty}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch flag");
      }
      const data = await response.json();
      setCurrentFlag(data.flagUrl);

      if (gameSettings?.gameMode.multipleChoice) {
        const otherOptions = getRandomCountries(3, randomCountry.name);
        setOptions(
          [randomCountry.name, ...otherOptions].sort(() => Math.random() - 0.5)
        );
      }
    } catch (error) {
      console.error("Error fetching flag:", error);
      // Retry with a different country
      fetchRandomFlag();
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        `/api/leaderboard?game=${encodeURIComponent("/games/flag-rush")}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data: LeaderBoardEntry[] = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const getRandomCountries = (count: number, exclude: string): string[] => {
    const availableCountries = countries.filter((c) => c.name !== exclude);
    return availableCountries
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((c) => c.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = userAnswer.toLowerCase() === currentCountry.toLowerCase();
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setUserAnswer("");
    fetchRandomFlag();
  };

  const handleNextQuestion = () => {
    setUserAnswer("");
    fetchRandomFlag();
  };

  const handleAnswerSelection = (option: string) => {
    setSelectedAnswer(option);
    setShowFeedback(true);

    if (option === currentCountry) {
      setScore((prevScore) => prevScore + 1);
    }

    // Delay before moving to the next question
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      fetchRandomFlag();
    }, 200); // 1.5 seconds delay
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Flag Rush
        </h1>
        {/* Exit button */}
        <button
          onClick={handleExit}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Exit
        </button>
        {showPreGamePrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <PreGamePrompt onStart={handleGameStart} />
          </div>
        )}
        {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
        {gameStarted && gameSettings && (
          <div className="flex">
            <div className="w-3/4 pr-8">
              <div className="flex flex-col items-center p-8 rounded-lg">
                <Timer duration={30} onComplete={handleTimerComplete} />
                <img
                  src={currentFlag}
                  alt="Flag"
                  className="w-full max-w-2xl mb-8 object-contain"
                />
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                  {gameSettings?.gameMode.text ? (
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter country name"
                      className="w-full p-4 mb-4 text-xl border rounded-lg"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelection(option)}
                          className={`p-4 text-xl border rounded-lg ${
                            showFeedback
                              ? option === currentCountry
                                ? "bg-green-500 text-white"
                                : selectedAnswer === option
                                ? "bg-red-500 text-white"
                                : "bg-white text-gray-800"
                              : "bg-white text-gray-800 hover:bg-gray-100"
                          }`}
                          disabled={showFeedback}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className="w-1/4">
              <LeaderBoard gamePath="/games/flag-rush" />
            </div>
          </div>
        )}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Your score: {score}</p>
              <button
                onClick={() => {
                  setGameOver(false);
                  setShowPreGamePrompt(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        {/* Exit confirmation modal */}
        {showExitConfirmation && (
          <ExitConfirmationModal
            onConfirm={confirmExit}
            onCancel={cancelExit}
          />
        )}
      </div>
    </div>
  );
};

export default FlagRushGame;
