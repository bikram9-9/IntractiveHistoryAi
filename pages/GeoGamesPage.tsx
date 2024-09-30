import React from "react";
import { Globe, Map, Award } from "lucide-react";
import GameCard from "./components/GameCard";

const GeoGamesPage = () => {
  return (
    <div className="bg-[#e5dac0] min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="text-3xl font-bold text-teal-800">GEO GAMES</div>
        <nav>
          <ul className="flex space-x-4 text-teal-800">
            <li className="underline">Home Us</li>
            <li>About</li>
            <li>Use</li>
          </ul>
        </nav>
      </header>

      <main>
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Globe className="w-12 h-12 text-teal-800" />
          <h1 className="text-5xl font-bold text-teal-800">GEO GAMES</h1>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
        </div>

        <div className="flex justify-center mb-8">
          <button className="bg-yellow-400 text-teal-800 font-bold py-2 px-8 rounded-full text-xl">
            HOME
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GameCard
            title="Learn Continents!"
            icon="Globe"
            buttonText="HOME"
            color="yellow"
          />
          <GameCard
            title="Find the Borders"
            icon="Map"
            buttonText="PLAY NOW"
            color="red"
          />
          <GameCard
            title="Find the Borders"
            icon="Map"
            buttonText="PLAY NOW"
            color="teal"
          />
        </div>
      </main>
    </div>
  );
};

export default GeoGamesPage;
