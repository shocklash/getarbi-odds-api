# GetArbi Odds Fetcher

Fetches betting odds using [The Odds API](https://the-odds-api.com/) and returns a clean JSON list.

## Deploy

1. Push to GitHub
2. Deploy on [Vercel](https://vercel.com)
3. Add `ODDS_API_KEY` as an environment variable (optional — it's hardcoded for now)

## Endpoint

`GET /api/odds`

Returns:

```json
[
  {
    "sport": "Baseball",
    "teams": ["Yankees", "Red Sox"],
    "commence_time": "2025-04-20T00:00:00Z",
    "bookmakers": [
      {
        "name": "DraftKings",
        "markets": [
          {
            "type": "h2h",
            "outcomes": [
              { "name": "Yankees", "price": -120 },
              { "name": "Red Sox", "price": +100 }
            ]
          }
        ]
      }
    ]
  }
]
```
