const axios = require('axios');
const detectArbitrage = require('./arbDetector');

const ODDS_API_KEY = 'efd53624e89841de697f2f4898623f14';
const SPORTS = ['basketball_nba', 'americanfootball_nfl', 'baseball_mlb'];
const REGION = 'us';
const MARKETS = ['h2h'];

async function fetchOddsForSport(sportKey) {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/`;
  try {
    const response = await axios.get(url, {
      params: {
        apiKey: ODDS_API_KEY,
        regions: REGION,
        markets: MARKETS.join(',')
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch odds for ${sportKey}:`, error.message);
    return [];
  }
}

export default async function handler(req, res) {
  try {
    const allEvents = [];

    for (const sport of SPORTS) {
      const events = await fetchOddsForSport(sport);
      allEvents.push(...events);
    }

    const opportunities = detectArbitrage(allEvents);
    res.status(200).json({ opportunities });
  } catch (error) {
    console.error("Error in arb detection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
