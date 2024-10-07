import React, { useState } from "react";
import { Globe, Map, Award } from "lucide-react";
import GameCard from "../components/GameCard";
import NavBar from "../components/NavBar";
import { IconType } from "../types/gametypes";

const GeoGamesPage = () => {
  const [games] = useState([
    {
      title: "Guess the Flag",
      icon: "Map" as IconType,
      buttonText: "PLAY NOW",
      bgColor: "geo-dark-pink",
      secondColor: "geo-green",
      gamePath: "/games/flag-rush",
    },
    {
      title: "Learn Continents!",
      icon: "Globe" as IconType,
      buttonText: "PLAY NOW",
      bgColor: "geo-yellow",
      secondColor: "geo-green",
      gamePath: "/games/continents",
    },
    {
      title: "Border Dash",
      icon: "Map" as IconType,
      buttonText: "PLAY NOW",
      bgColor: "geo-light-teal",
      secondColor: "geo-green",
      gamePath: "/games/border-dash",
    },
    {
      title: "Name Capitals",
      icon: "Map" as IconType,
      buttonText: "PLAY NOW",
      bgColor: "geo-light-teal",
      secondColor: "geo-green",
      gamePath: "/games/capitals",
    },
    {
      title: "Name All Countries",
      icon: "Map" as IconType,
      buttonText: "PLAY NOW",
      bgColor: "geo-light-teal",
      secondColor: "geo-green",
      gamePath: "/games/countries",
    },
    {
      title: "Name All States in USA",
      icon: "Map" as IconType,
      buttonText: "PLAY NOW",
      bgColor: "geo-light-teal",
      secondColor: "geo-green",
      gamePath: "/games/usa-states",
    },
    {
      title: "Name All Countries in Europe",
      icon: "Map" as IconType,
      buttonText: "PLAY NOW",
      bgColor: "geo-yellow",
      secondColor: "geo-green",
      gamePath: "/games/europe-countries",
    },
  ]);

  return (
    <>
      <NavBar />

      <div className="bg-[#e5dac0] min-h-screen p-8">
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
            {games.map((game, index) => (
              <GameCard
                key={index}
                title={game.title}
                icon={game.icon}
                buttonText={game.buttonText}
                bgColor={game.bgColor}
                secondColor={game.secondColor}
                gamePath={game.gamePath}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default GeoGamesPage;
