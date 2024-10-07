import React from "react";
import { Globe, Map, MapPin, LucideIcon } from "lucide-react";
import { useRouter } from "next/router";
import { GameCardProps, IconType } from "../types/gametypes";

const iconComponents: Record<IconType, LucideIcon> = {
  Globe,
  Map,
  MapPin,
};

const GameCard: React.FC<GameCardProps> = ({
  title,
  icon,
  buttonText,
  bgColor,
  secondColor,
  gamePath,
}) => {
  const router = useRouter();
  const IconComponent = iconComponents[icon] || Map;

  const handleClick = () => {
    router.push(gamePath);
  };

  return (
    <div className={`bg-${bgColor} p-6 rounded-2xl shadow-md text-center`}>
      <h2 className="text-xl font-bold mb-4 text-teal-800">
        {title.toUpperCase()}
      </h2>
      <IconComponent className="w-20 h-20 mx-auto mb-4 text-teal-600 mt-2" />
      <div
        className={`bg-${secondColor} w-full h-20 flex items-center justify-center`}
      >
        <button
          onClick={handleClick}
          className="bg-white text-teal-800 font-bold py-2 px-8 rounded-full shadow-sm hover:bg-teal-50 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default GameCard;
