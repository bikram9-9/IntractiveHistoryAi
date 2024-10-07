import { LucideIcon } from "lucide-react";

export type IconType = "Globe" | "Map" | "MapPin";

export interface GameCardProps {
  title: string;
  icon: IconType;
  buttonText: string;
  bgColor: string;
  secondColor: string;
  gamePath: string;
}

export type IconComponentsType = Record<IconType, LucideIcon>;

export type PlayerLevel =
  | "NOOBIE"
  | "GLOBETROTTER"
  | "MAPMANIAC"
  | "ATLASMASTER"
  | "GEOWIZARD";

export interface LeaderBoardEntry {
  user: {
    name: string;
    id: string;
    email: string;
    games: PlayedGame[];
  };
  score: number;
  rank: number;
  level: PlayerLevel;
}

export interface PlayedGame {
  game: { path: string };
  rank: number;
  highScore: number;
  level: PlayerLevel;
}

export interface Game {
  path: string;
}

export interface Country {
  name: string;
  code: string;
  difficultyScore: string;
}

export interface GameSettings {
  gameMode: {
    text: boolean;
    multipleChoice: boolean;
  };
  difficulty: "easy" | "medium" | "hard";
  timer: number;
}
