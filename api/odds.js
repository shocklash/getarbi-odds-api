import fetch from 'node-fetch';
export default async function handler(req, res) {
  const ODDS_API_KEY = process.env.ODDS_API_KEY || "efd53624e89841de697f2f4898623f14";

  const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: "Failed to fetch odds", details: error });
    }

    const data = await response.json();

    const cleanOdds = data.map(game => ({
      sport: game.sport_title,
      teams: game.teams,
      commence_time: game.commence_time,
      bookmakers: game.bookmakers.map(bm => ({
        name: bm.title,
        markets: bm.markets.map(market => ({
          type: market.key,
          outcomes: market.outcomes
        }))
      }))
    }));

    res.status(200).json(cleanOdds);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}
