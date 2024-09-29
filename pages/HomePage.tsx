import React, { useState } from "react";
import dynamic from "next/dynamic";
import Calendar from "./components/ui/calendar";

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
      <EarthSimulation />
      {/* <div className="absolute top-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Enter city or country"
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocation(e.target.value)
            }
            className="flex-grow min-w-[280px] px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 ease-in-out hover:bg-white/20 hover:border-white/40"
          />
          <Calendar date={date} onChange={setDate} />
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 ease-in-out whitespace-nowrap"
          >
            Let's Go
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;
