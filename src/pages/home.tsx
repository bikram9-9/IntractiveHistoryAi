import React, { useState } from "react";
import dynamic from "next/dynamic";
import GeoGamesPage from "./geo-games";

const EarthSimulation = dynamic(() => import("../components/EarthSimulation"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  return (
    <div className="relative w-screen h-screen">
      <GeoGamesPage />
    </div>
  );
};

export default HomePage;
