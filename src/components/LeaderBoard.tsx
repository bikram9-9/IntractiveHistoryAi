import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LeaderBoardEntry } from "@/types/gametypes";
import { config } from "@/config";
import mockLeaderBoardData from "@/lib/mock-data/leaderboard.json";

interface LeaderboardProps {
  gamePath: string;
}

const LeaderBoard: React.FC<LeaderboardProps> = ({ gamePath }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderBoardData] = useState<LeaderBoardEntry[]>(
    []
  );
  const entriesPerPage = 20;

  useEffect(() => {
    fetchLeaderBoardData();
  }, [gamePath]);

  const fetchLeaderBoardData = async () => {
    try {
      let data;

      // Fetch real data
      const response = await fetch(
        `/api/leaderboard?game=${encodeURIComponent(gamePath)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      data = await response.json();

      setLeaderBoardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const totalPages = Math.ceil(leaderboardData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = leaderboardData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6 rounded-lg shadow-md bg-geo-green-light">
      <h2 className="text-2xl font-bold mb-4 text-geo-green">Leaderboard</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-geo-green">
            <th className="pb-2">Rank</th>
            <th className="pb-2">Name</th>
            <th className="pb-2">Level</th>
            <th className="pb-2 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry, index) => {
            const gameData = entry.user.games.find(
              (game) => game.game.path === gamePath
            );
            return (
              <tr key={entry.user.id} className="border-t border-gray-200">
                <td className="py-2 text-geo-green">
                  {startIndex + index + 1}
                </td>
                <td className="py-2 text-geo-green">{entry.user.name}</td>
                <td className="py-2 text-geo-green">
                  {gameData?.level?.toString() || "N/A"}
                </td>
                <td className="py-2 text-geo-green font-semibold text-right">
                  {gameData?.highScore || "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex items-center text-geo-green disabled:text-gray-400"
        >
          <ChevronLeft size={20} />
          Prev
        </button>
        <span className="text-geo-green">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center text-geo-green disabled:text-gray-400"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default LeaderBoard;
