
const axios = require('axios');

const ODDS_API_KEY = 'efd53624e89841de697f2f4898623f14';
const SPORTS = ['basketball_nba', 'americanfootball_nfl', 'baseball_mlb'];
const REGION = 'us';
const MARKETS = ['h2h', 'spreads', 'totals'];

async function fetchOddsForSport(sportKey) {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/`;
  try {
    const response = await axios.get(url, {
      params: {
        apiKey: ODDS_API_KEY,
        regions: REGION,
        markets: MARKETS.join(','),
        oddsFormat: 'american'
      }
    });

    return response.data.map(event => ({
      eventId: event.id,
      sport: event.sport_key,
      teams: event.teams,
      startTime: event.commence_time,
      books: event.bookmakers.map(book => ({
        name: book.title,
        markets: Object.fromEntries(
          book.markets.map(m => [
            m.key,
            Object.fromEntries(m.outcomes.map(o => [o.name, o.price]))
          ])
        )
      }))
    }));
  } catch (err) {
    console.error(`Failed fetching ${sportKey}:`, err.message);
    return [];
  }
}

module.exports = async (req, res) => {
  const allEvents = await Promise.all(SPORTS.map(fetchOddsForSport));
  const combined = allEvents.flat();
  res.status(200).json(combined);
};
