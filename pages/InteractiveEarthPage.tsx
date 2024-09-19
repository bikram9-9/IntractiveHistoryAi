import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import type { NextPage } from "next";
import axios from "axios";

// Dynamically import Globe with no SSR
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Import HistoryCards component
import HistoryCards from "./components/HistoryCards";

interface ExtendedGlobeProps {
  globeImageUrl: string;
  backgroundImageUrl: string;
  pointsData: Array<{ lat: number; lng: number }>;
  pointAltitude: number;
  pointColor: () => string;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

interface SearchResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

interface HistoryEvent {
  id: number;
  title: string;
  description: string;
  year: number;
}

const InteractiveEarthPage: NextPage = () => {
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [globeCenter, setGlobeCenter] = useState<{
    lat: number;
    lng: number;
    altitude: number;
  }>({ lat: 0, lng: 0, altitude: 2.5 });
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [showCards, setShowCards] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: location,
            key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
            limit: 1,
          },
        }
      );

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setCoordinates([lat, lng]);
        setGlobeCenter({ lat, lng, altitude: 1.5 });

        // Fetch historical events for the location and date
        const year = new Date(date).getFullYear();
        const events = await fetchHistoricalEvents(lat, lng, year);
        setHistoryEvents(events);
        setShowCards(true);
      } else {
        console.log("Location not found");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
  }, [location, date]);

  const fetchHistoricalEvents = async (
    lat: number,
    lng: number,
    year: number
  ): Promise<HistoryEvent[]> => {
    // This is a placeholder function. In a real application, you would fetch actual historical data from an API or database.
    return [
      {
        id: 1,
        title: "Major Discovery",
        description:
          "Scientists made a groundbreaking discovery that revolutionized our understanding of the universe.",
        year: year - 10,
      },
      {
        id: 2,
        title: "Cultural Renaissance",
        description:
          "A vibrant cultural movement swept across the region, inspiring new forms of art, music, and literature.",
        year: year - 5,
      },
      {
        id: 3,
        title: "Technological Breakthrough",
        description:
          "A new technology was invented that transformed daily life and industry.",
        year: year,
      },
      {
        id: 4,
        title: "Political Upheaval",
        description:
          "A significant political event reshaped the region's governance structure and international relations.",
        year: year - 2,
      },
      {
        id: 5,
        title: "Environmental Milestone",
        description:
          "A major environmental initiative was launched, addressing critical ecological challenges.",
        year: year - 7,
      },
    ];
  };

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocation(value);

      if (value.length > 2) {
        try {
          const response = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
              params: {
                q: value,
                key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
                limit: 5,
              },
            }
          );
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Error during geosearch:", error);
        }
      } else {
        setSearchResults([]);
      }
    },
    []
  );

  const handleResultClick = useCallback((result: SearchResult) => {
    setLocation(result.formatted);
    setCoordinates([result.geometry.lat, result.geometry.lng]);
    setGlobeCenter({
      lat: result.geometry.lat,
      lng: result.geometry.lng,
      altitude: 1.5,
    });
    setSearchResults([]);
  }, []);

  const globeProps: ExtendedGlobeProps = {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    backgroundImageUrl: "//unpkg.com/three-globe/example/img/night-sky.png",
    pointsData: [{ lat: coordinates[0], lng: coordinates[1] }],
    pointAltitude: 0.1,
    pointColor: () => "red",
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  return (
    <div className="h-screen w-full relative bg-white dark:bg-gray-900">
      <div className="absolute inset-0">
        <Globe
          {...(globeProps as any)}
          center={`${globeCenter.lat},${globeCenter.lng}`}
          focusOn={[globeCenter]}
        />
      </div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter city, region, or country"
              value={location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition duration-150 ease-in-out hover:scale-[1.02] text-gray-800 dark:text-white"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm border border-gray-300 dark:border-gray-600 mt-1 rounded-md shadow-sm">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                    onClick={() => handleResultClick(result)}
                  >
                    {result.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
            className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition duration-150 ease-in-out hover:scale-[1.02] text-gray-800 dark:text-white"
          />
          <Button
            onClick={handleSearch}
            className="px-4 py-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-opacity-100 dark:hover:bg-opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 transition duration-150 ease-in-out hover:scale-[1.02] cursor-pointer text-gray-800 dark:text-white"
          >
            Search
          </Button>
        </div>
      </div>
      {showCards && (
        <HistoryCards
          events={historyEvents}
          onClose={() => setShowCards(false)}
        />
      )}
    </div>
  );
};

export default InteractiveEarthPage;
