import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { LeaderBoardEntry, PlayerLevel } from "@/types/gametypes";
import { config } from "@/config";
import mockLeaderboardData from "@/lib/mock-data/leaderboard.json";
import { testConnection } from "@/lib/db";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderBoardEntry[] | { error: string }>
) {
  const { method } = req;
  const gamePath = req.query["game"] as string;

  if (method === "GET") {
    try {
      if (!gamePath) {
        return res
          .status(400)
          .json({ error: "game-path query parameter is required" });
      }

      let leaderBoard: LeaderBoardEntry[];

      if (!config.useMockData) {
        // Test the database connection
        await testConnection();

        leaderBoard = await prisma.score.findMany({
          where: {
            game: {
              path: gamePath,
            },
          },
          select: {
            user: {
              select: {
                name: true,
                id: true,
                email: true,
                games: {
                  select: {
                    game: true,
                    rank: true,
                    highScore: true,
                    level: true,
                  },
                },
              },
            },
            score: true,
          },
          orderBy: {
            score: "desc",
          },
          take: 50,
        });
      } else {
        // Use mock data as a database
        leaderBoard = mockLeaderboardData
          .filter((entry) =>
            entry.user.games.some((game) => game.game.path === gamePath)
          )
          .map((entry) => {
            const gameData = entry.user.games.find(
              (game) => game.game.path === gamePath
            );
            return {
              user: {
                ...entry.user,
                games: entry.user.games.map((game) => ({
                  ...game,
                  level: game.level as PlayerLevel,
                })),
              },
              score: gameData?.highScore || 0,
              rank: gameData?.rank || 0,
              level:
                (gameData?.level as PlayerLevel) || ("NOOBIE" as PlayerLevel),
            };
          });
      }
      console.log(leaderBoard);
      res.status(200).json(leaderBoard);
    } catch (error) {
      console.error("Error fetching leaderBoard:", error);
      res.status(500).json({ error: "Failed to fetch leaderBoard" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
