import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

interface CountryCode {
  name: string;
  code: string;
  difficultyScore: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { country, difficulty } = req.query;

  if (!country || typeof country !== "string") {
    return res.status(400).json({ error: "Country name is required" });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "countries.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    const countries: CountryCode[] = JSON.parse(fileContents);

    // Filter countries based on difficulty
    const filteredCountries = difficulty
      ? countries.filter((c) => c.difficultyScore === difficulty)
      : countries;

    // Find the country code
    const countryData = filteredCountries.find(
      (c) => c.name.toLowerCase() === country.toLowerCase()
    );

    if (!countryData) {
      return res.status(404).json({ error: "Country not found" });
    }

    // Fetch country data from REST Countries API
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryData.code}`
    );
    const [countryInfo] = await response.json();

    if (!countryInfo || !countryInfo.flags) {
      return res.status(404).json({ error: "Flag not found" });
    }

    const flagUrl = countryInfo.flags.svg || countryInfo.flags.png;

    res.status(200).json({ flagUrl });
  } catch (error) {
    console.error("Error processing flag request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
