import React, { useState } from "react";
import dynamic from "next/dynamic";
import Calendar from "./components/ui/calendar";
import GeoGamesPage from "./GeoGamesPage";

const EarthSimulation = dynamic(() => import("./EarthSimulation"), {
  ssr: false,
});

const HomePage: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = () => {
    console.log("Submitted:", { location, date });
    // Add your logic here for what happens when the button is clicked
  };

  return (
    <div className="relative w-screen h-screen">
      <GeoGamesPage/>
    </div>
  );
};

export default HomePage;
