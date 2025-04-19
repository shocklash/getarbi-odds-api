function detectArbitrage(events) {
  const opportunities = [];

  for (const event of events) {
    const { eventId, teams, startTime, books } = event;

    const bestOdds = {
      [teams[0]]: { book: null, odds: null },
      [teams[1]]: { book: null, odds: null }
    };

    for (const book of books) {
      const h2h = book.markets?.h2h;
      if (!h2h) continue;

      for (const team of teams) {
        const price = h2h[team];
        if (price != null && (bestOdds[team].odds == null || price > bestOdds[team].odds)) {
          bestOdds[team] = { book: book.name, odds: price };
        }
      }
    }

    const implied1 = 1 / bestOdds[teams[0]].odds;
    const implied2 = 1 / bestOdds[teams[1]].odds;
    const totalImplied = implied1 + implied2;

    if (totalImplied < 1) {
      opportunities.push({
        eventId,
        teams,
        startTime,
        bets: [
          { team: teams[0], ...bestOdds[teams[0]] },
          { team: teams[1], ...bestOdds[teams[1]] }
        ],
        impliedProbability: totalImplied,
        profitMargin: (1 - totalImplied).toFixed(4)
      });
    }
  }

  return opportunities;
}

module.exports = detectArbitrage;
