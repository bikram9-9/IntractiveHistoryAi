import React from "react";
import { Globe, Map, MapPin, LucideIcon } from "lucide-react";

type IconType = "Globe" | "Map" | "MapPin";

type GameCardProps = {
  title: string;
  icon: IconType;
  buttonText: string;
  color: string;
};

const iconComponents: Record<IconType, LucideIcon> = {
  Globe,
  Map,
  MapPin,
};

const GameCard: React.FC<GameCardProps> = ({
  title,
  icon,
  buttonText,
  color,
}) => {
  const IconComponent = iconComponents[icon] || Map;

  return (
    <div className={`bg-${color}-100 p-6 rounded-2xl shadow-md text-center`}>
      <h2 className="text-xl font-bold mb-4 text-teal-800">
        {title.toUpperCase()}
      </h2>
      <IconComponent className="w-20 h-20 mx-auto mb-4 text-teal-600" />
      <button className="bg-white text-teal-800 font-bold py-2 px-8 rounded-full shadow-sm hover:bg-teal-50 transition-colors">
        {buttonText}
      </button>
    </div>
  );
};

export default GameCard;
