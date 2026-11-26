// Nippon Data Atlas — figures for Japan.
// Every value below is a published figure; its source and year are listed
// in data-sources.md at the repository root and on the site's Data page.
// Population of prefectures is in units of 10,000 persons, as of 1 October
// 2024, Statistics Bureau of Japan, Population Estimates.

const JAPAN = {
  name: "Japan",
  capital: "Tokyo",
  currency: "Japanese yen (JPY)",
  landAreaKm2: { value: 364569, year: 2023, source: "World Bank WDI" },
  population: {
    // total population, millions, World Bank WDI (SP.POP.TOTL)
    series: [
      { year: 2015, value: 127.1 }, { year: 2016, value: 127.0 },
      { year: 2017, value: 126.8 }, { year: 2018, value: 126.5 },
      { year: 2019, value: 126.3 }, { year: 2020, value: 125.7 },
      { year: 2021, value: 125.5 }, { year: 2022, value: 125.1 },
      { year: 2023, value: 124.4 }, { year: 2024, value: 124.0 }
    ],
    latest: { value: 123975371, display: "124.0 million", year: 2024 },
    growthPct: { value: -0.4, year: 2024 },
    densityPerKm2: { value: 342, year: 2024 },
    urbanPct: { value: 92.2, year: 2024 },
    fertility: { value: 1.2, year: 2023 },
    births: { value: 727277, year: 2023, source: "MHLW Vital Statistics" },
    deaths: { value: 1590503, year: 2023, source: "MHLW Vital Statistics" },
    birthRatePer1000: { value: 5.7, year: 2024 },
    deathRatePer1000: { value: 13.3, year: 2024 }
  },
  ageStructure: [
    // shares of total population, %, World Bank WDI
    { year: 2000, young014: 14.6, working1564: 68.0, older65: 17.4 },
    { year: 2010, young014: 13.1, working1564: 63.8, older65: 23.0 },
    { year: 2020, young014: 11.9, working1564: 59.5, older65: 28.6 },
    { year: 2024, young014: 11.4, working1564: 58.8, older65: 29.8 }
  ],
  economy: {
    // nominal GDP, current US$ billions, World Bank WDI (NY.GDP.MKTP.CD)
    gdpNominal: [
      { year: 2015, value: 4534 }, { year: 2016, value: 5110 },
      { year: 2017, value: 5038 }, { year: 2018, value: 5154 },
      { year: 2019, value: 5246 }, { year: 2020, value: 5189 },
      { year: 2021, value: 5226 }, { year: 2022, value: 4448 },
      { year: 2023, value: 4385 }, { year: 2024, value: 4190 }
    ],
    // real GDP growth, % per year, IMF World Economic Outlook
    gdpGrowth: [
      { year: 2015, value: 1.6 }, { year: 2016, value: 0.8 },
      { year: 2017, value: 1.7 }, { year: 2018, value: 0.6 },
      { year: 2019, value: -0.4 }, { year: 2020, value: -4.2 },
      { year: 2021, value: 2.6 }, { year: 2022, value: 1.0 },
      { year: 2023, value: 1.9 }, { year: 2024, value: 0.1 }
    ],
    gdpPerCapitaUsd: { value: 33797, year: 2024 },
    gdpPerCapitaPpp: { value: 52039, year: 2024 },
    inflationPct: { value: 2.7, year: 2024 },
    unemploymentPct: { value: 2.5, year: 2024 },
    labourForceMillion: { value: 69.3, year: 2024 },
    labourParticipationPct: { value: 63.2, year: 2024 },
    gini: { value: 32.3, year: 2020 },
    hdi: { value: 0.925, year: 2023, source: "UNDP Human Development Report" },
    sectorsGvaPct: { services: 70.3, industry: 28.7, agriculture: 1.0, year: 2024 },
    sectorsJobsPct: { services: 73.8, industry: 23.3, agriculture: 2.9, year: 2024 },
    tradeGoods: {
      exportsUsdBn: 718, importsUsdBn: 752, balanceUsdBn: -34, year: 2024,
      exportMarkets: [
        { partner: "United States", sharePct: 20.2 },
        { partner: "China", sharePct: 17.6 },
        { partner: "South Korea", sharePct: 6.5 }
      ],
      importSuppliers: [
        { partner: "China", sharePct: 22.4 },
        { partner: "United States", sharePct: 10.1 },
        { partner: "Australia", sharePct: 8.6 }
      ],
      exportProducts: [
        { product: "Vehicles and parts", sharePct: 21.7 },
        { product: "Machinery and computers", sharePct: 19.1 },
        { product: "Electrical machinery and electronics", sharePct: 18.5 }
      ]
    },
    researchPctGdp: { value: 3.4, year: 2022 },
    researchersPerMillion: { value: 5630, year: 2022 }
  },
  health: {
    lifeExpectancy: { value: 84.0, year: 2024 },
    lifeExpectancyMen: { value: 81.1, year: 2023 },
    lifeExpectancyWomen: { value: 87.1, year: 2023 },
    infantMortalityPer1000: { value: 1.8, year: 2024 },
    underFiveMortalityPer1000: { value: 2.4, year: 2024 },
    physiciansPer1000: { value: 2.65, year: 2022 },
    hospitalBedsPer1000: { value: 12.6, year: 2022 },
    healthSpendingPctGdp: { value: 10.7, year: 2023 },
    doctorVisitsPerPerson: { value: 12.1, year: 2023, source: "OECD Health at a Glance" }
  },
  education: {
    meanYearsSchooling: { value: 12.7, year: 2023, source: "UNDP" },
    expectedYearsSchooling: { value: 15.5, year: 2023, source: "UNDP" },
    tertiaryEnrolmentPct: { value: 64.9, year: 2023 },
    primaryEnrolmentPct: { value: 102.5, year: 2023 },
    secondaryEnrolmentPct: { value: 102.3, year: 2023 },
    spendingPctGdp: { value: 3.3, year: 2021 },
    pupilTeacherPrimary: { value: 15.7, year: 2017 }
  },
  society: {
    homicidesPer100k: { value: 0.2, year: 2023 },
    womenInParliamentPct: { value: 15.7, year: 2024 }
  }
};

// Prefectures: population in units of 1,000 persons, 1 October 2024,
// Statistics Bureau of Japan, Population Estimates.
const PREFECTURES = [
  { name: "Tokyo", region: "Kanto", pop: 14178 },
  { name: "Kanagawa", region: "Kanto", pop: 9225 },
  { name: "Osaka", region: "Kansai", pop: 8757 },
  { name: "Aichi", region: "Chubu", pop: 7460 },
  { name: "Saitama", region: "Kanto", pop: 7332 },
  { name: "Chiba", region: "Kanto", pop: 6251 },
  { name: "Hyogo", region: "Kansai", pop: 5337 },
  { name: "Fukuoka", region: "Kyushu", pop: 5092 },
  { name: "Hokkaido", region: "Hokkaido", pop: 5043 },
  { name: "Shizuoka", region: "Chubu", pop: 3527 },
  { name: "Ibaraki", region: "Kanto", pop: 2806 },
  { name: "Hiroshima", region: "Chugoku", pop: 2714 },
  { name: "Kyoto", region: "Kansai", pop: 2520 },
  { name: "Miyagi", region: "Tohoku", pop: 2248 },
  { name: "Niigata", region: "Chubu", pop: 2099 },
  { name: "Nagano", region: "Chubu", pop: 1987 },
  { name: "Gifu", region: "Chubu", pop: 1916 },
  { name: "Gunma", region: "Kanto", pop: 1890 },
  { name: "Tochigi", region: "Kanto", pop: 1885 },
  { name: "Okayama", region: "Chugoku", pop: 1831 },
  { name: "Fukushima", region: "Tohoku", pop: 1743 },
  { name: "Mie", region: "Kansai", pop: 1711 },
  { name: "Kumamoto", region: "Kyushu", pop: 1697 },
  { name: "Kagoshima", region: "Kyushu", pop: 1532 },
  { name: "Okinawa", region: "Kyushu", pop: 1466 },
  { name: "Shiga", region: "Kansai", pop: 1402 },
  { name: "Nara", region: "Kansai", pop: 1285 },
  { name: "Yamaguchi", region: "Chugoku", pop: 1281 },
  { name: "Ehime", region: "Shikoku", pop: 1276 },
  { name: "Nagasaki", region: "Kyushu", pop: 1252 },
  { name: "Aomori", region: "Tohoku", pop: 1165 },
  { name: "Iwate", region: "Tohoku", pop: 1145 },
  { name: "Ishikawa", region: "Chubu", pop: 1098 },
  { name: "Oita", region: "Kyushu", pop: 1085 },
  { name: "Miyazaki", region: "Kyushu", pop: 1033 },
  { name: "Yamagata", region: "Tohoku", pop: 1011 },
  { name: "Toyama", region: "Chubu", pop: 997 },
  { name: "Kagawa", region: "Shikoku", pop: 917 },
  { name: "Akita", region: "Tohoku", pop: 897 },
  { name: "Wakayama", region: "Kansai", pop: 880 },
  { name: "Yamanashi", region: "Chubu", pop: 791 },
  { name: "Saga", region: "Kyushu", pop: 788 },
  { name: "Fukui", region: "Chubu", pop: 739 },
  { name: "Tokushima", region: "Shikoku", pop: 685 },
  { name: "Kochi", region: "Shikoku", pop: 656 },
  { name: "Shimane", region: "Chugoku", pop: 642 },
  { name: "Tottori", region: "Chugoku", pop: 531 }
];

const REGIONS = [
  "Hokkaido", "Tohoku", "Kanto", "Chubu",
  "Kansai", "Chugoku", "Shikoku", "Kyushu"
];

// Region totals, computed from the prefecture estimates above, in
// 1,000 persons. They sum to the national total of 123,802 (×1,000).
function regionTotals() {
  const totals = {};
  for (const region of REGIONS) totals[region] = 0;
  for (const prefecture of PREFECTURES) {
    totals[prefecture.region] += prefecture.pop;
  }
  return totals;
}

function prefecturesIn(region) {
  return PREFECTURES.filter((p) => p.region === region);
}

function formatMillions(unitsOfOneThousand) {
  return (unitsOfOneThousand / 1000).toFixed(2) + " million";
}

function gdpPerCapita(year) {
  const gdp = JAPAN.economy.gdpNominal.find((row) => row.year === year);
  const pop = JAPAN.population.series.find((row) => row.year === year);
  if (!gdp || !pop) return null;
  return Math.round((gdp.value * 1000) / pop.value);
}
