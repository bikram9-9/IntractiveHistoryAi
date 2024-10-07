import { useEffect, useState } from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import HomePage from "./home";

// Dynamically import the EarthSimulation component with SSR disabled
const EarthSimulation = dynamic(() => import("../components/EarthSimulation"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isMounted && <HomePage />}
    </div>
  );
};

export default Home;
