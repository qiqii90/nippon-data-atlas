# Nippon Data Atlas

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/qiqii90/nippon-data-atlas/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/qiqii90/nippon-data-atlas/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics site for **Japan** — population, economy, health,
education and all 47 prefectures — built for the make.fun bounty
“Make the best national statistics site”.

## What it is

A static site under `app/` with no build step and no network requests. Open
`app/index.html` in a browser (or serve `app/` with any static server) and it
works on desktop and on a phone.

- **Overview** (`index.html`) — six key indicators, population trend, GDP,
  age structure, the five largest prefectures, a searchable indicator list.
- **Population** (`population.html`) — year selector (2015–2024) that updates
  the figures and the chart, age-structure explorer, births and deaths.
- **Economy** (`economy.html`) — GDP chart with a nominal / real-growth
  toggle and year selector, sector shares, trade partners, labour market.
- **Health & Education** (`health.html`) — tabs switching between health and
  education, with life expectancy, mortality, doctors, beds, schooling.
- **Regions** (`regions.html`) — eight region cards that filter the table,
  search, sortable columns, and a compare-up-to-three prefectures chart.
- **Data & Sources** (`data.html`) — every figure with its source and year,
  method notes, and a button that downloads all figures as CSV.

Charts are hand-built inline SVG from `app/charts.js`; all figures live in
`app/data.js`. Nothing is fetched from anywhere.

## One clear edge

Every figure is sourced and dated, explorable by region and year, with
working comparisons — and the sources page lists each figure's origin.

## Hand-in

`main.ts` (Node 22) copies `app/` and `screenshots/` to `/output` (or
`$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json` with `buildDossier`
from `vendor/makefun-frontend.ts` (the kit's copy, unchanged).

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Run it twice: both runs write identical bytes.

## Screenshots

`screenshots/` holds four real renders of the site's own code: the overview
(cover), the economy page, the regions page, and the overview at phone size
(390×844).

## Sources

See `data-sources.md`. Headline sources: World Bank World Development
Indicators, IMF World Economic Outlook, OECD Health Statistics, UNDP Human
Development Report, Statistics Bureau of Japan Population Estimates,
Ministry of Health, Labour and Welfare Vital Statistics, WITS / World Bank
trade data.

## License

MIT — see `LICENSE`. This atlas is independent and not affiliated with the
Statistics Bureau of Japan or any government body.

---

<sub>Entered on [make.fun](https://make.fun/bounty/best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
