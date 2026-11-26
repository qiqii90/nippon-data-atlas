// Nippon Data Atlas — page wiring: charts, selectors, search, sort, tabs.
// Runs on every page; each block only acts when its elements exist, so a
// page never breaks because another page's controls are absent.

(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function moneyBn(v) { return "$" + v.toLocaleString("en-US") + "bn"; }

  // ---- shared: population trend line -------------------------------------
  function drawPopulationChart(highlightYear) {
    const host = $("pop-chart");
    if (!host) return;
    const points = JAPAN.population.series.map((row) => ({ x: String(row.year), y: row.value }));
    const idx = highlightYear
      ? points.findIndex((p) => p.x === String(highlightYear)) : -1;
    host.innerHTML = lineChart(points, {
      label: "Japan population 2015 to 2024, millions",
      format: (v) => v.toFixed(1),
      highlightIndex: idx,
      showAllLabels: false
    });
  }

  // ---- shared: GDP chart, nominal or real growth --------------------------
  function drawGdpChart(mode, highlightYear) {
    const host = $("gdp-chart");
    if (!host) return;
    if (mode === "growth") {
      const points = JAPAN.economy.gdpGrowth.map((row) => ({ x: String(row.year), y: row.value }));
      const idx = highlightYear ? points.findIndex((p) => p.x === String(highlightYear)) : -1;
      host.innerHTML = lineChart(points, {
        label: "Japan real GDP growth 2015 to 2024, percent per year",
        format: (v) => v.toFixed(1) + "%",
        color: CHART_COLORS.indigo,
        highlightIndex: idx
      });
    } else {
      const bars = JAPAN.economy.gdpNominal.map((row) => ({ label: String(row.year), value: row.value }));
      const idx = highlightYear ? bars.findIndex((b) => b.label === String(highlightYear)) : -1;
      host.innerHTML = barChart(bars, {
        label: "Japan nominal GDP 2015 to 2024, billion US dollars",
        format: moneyBn,
        highlightIndex: idx
      });
    }
  }

  // ---- shared: age structure ----------------------------------------------
  function drawAgeChart(year) {
    const host = $("age-chart");
    if (!host) return;
    const row = JAPAN.ageStructure.find((r) => r.year === year) || JAPAN.ageStructure[3];
    host.innerHTML = stackedBar([
      { label: "Aged 0–14", value: row.young014, color: CHART_COLORS.sage },
      { label: "Aged 15–64", value: row.working1564, color: CHART_COLORS.indigo },
      { label: "Aged 65+", value: row.older65, color: CHART_COLORS.red }
    ], { label: "Japan age structure " + row.year });
    const note = $("age-note");
    if (note) {
      note.textContent = "In " + row.year + ", " + row.older65.toFixed(1) +
        "% of Japan's people were aged 65 or older, and " + row.young014.toFixed(1) +
        "% were children under 15. Source: World Bank WDI.";
    }
    document.querySelectorAll("[data-age-year]").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.ageYear) === row.year);
      btn.setAttribute("aria-pressed", String(Number(btn.dataset.ageYear) === row.year));
    });
  }

  // ---- overview page -------------------------------------------------------
  function initOverview() {
    drawPopulationChart(2024);
    drawGdpChart("nominal", 2024);
    drawAgeChart(2024);
    const top5 = $("top-prefectures");
    if (top5) {
      top5.innerHTML = hbarChart(PREFECTURES.slice(0, 5).map((p) => ({
        label: p.name, value: p.pop / 1000
      })), {
        label: "Five largest prefectures by population, 2024",
        format: (v) => v.toFixed(2) + "m"
      });
    }
    const search = $("indicator-search");
    const list = $("indicator-list");
    if (search && list) {
      search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        let shown = 0;
        list.querySelectorAll("tr[data-name]").forEach((row) => {
          const hit = !q || row.dataset.name.toLowerCase().includes(q);
          row.style.display = hit ? "" : "none";
          if (hit) shown += 1;
        });
        const empty = $("indicator-empty");
        if (empty) empty.style.display = shown === 0 ? "" : "none";
        const count = $("indicator-count");
        if (count) count.textContent = shown + " of " + list.querySelectorAll("tr[data-name]").length + " indicators";
      });
    }
  }

  // ---- population page ------------------------------------------------------
  function initPopulation() {
    drawPopulationChart(2024);
    drawAgeChart(2024);
    const select = $("pop-year");
    if (select) {
      select.addEventListener("change", () => {
        const year = Number(select.value);
        const row = JAPAN.population.series.find((r) => r.year === year);
        if (!row) return;
        drawPopulationChart(year);
        const card = $("pop-year-value");
        if (card) card.textContent = row.value.toFixed(1) + " million";
        const prev = JAPAN.population.series.find((r) => r.year === year - 1);
        const change = $("pop-year-change");
        if (change && prev) {
          const diff = row.value - prev.value;
          change.textContent = (diff <= 0 ? "" : "+") + diff.toFixed(1) +
            " million on " + (year - 1) + " (" + ((diff / prev.value) * 100).toFixed(2) + "%)";
        }
        const cap = $("pop-year-capita");
        if (cap) cap.textContent = "$" + gdpPerCapita(year).toLocaleString("en-US");
      });
    }
    document.querySelectorAll("[data-age-year]").forEach((btn) => {
      btn.addEventListener("click", () => drawAgeChart(Number(btn.dataset.ageYear)));
    });
  }

  // ---- economy page ---------------------------------------------------------
  function initEconomy() {
    let mode = "nominal";
    drawGdpChart(mode, 2024);
    document.querySelectorAll("[data-gdp-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        mode = btn.dataset.gdpMode;
        document.querySelectorAll("[data-gdp-mode]").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        const yearSel = $("gdp-year");
        drawGdpChart(mode, yearSel ? Number(yearSel.value) : 2024);
        const hint = $("gdp-hint");
        if (hint) {
          hint.textContent = mode === "growth"
            ? "Real GDP growth: year-on-year change in GDP at constant prices, IMF World Economic Outlook."
            : "Nominal GDP at current prices, converted to US dollars at the year's average exchange rate, World Bank WDI.";
        }
      });
    });
    const select = $("gdp-year");
    if (select) {
      select.addEventListener("change", () => {
        const year = Number(select.value);
        drawGdpChart(mode, year);
        const gdp = JAPAN.economy.gdpNominal.find((r) => r.year === year);
        const growth = JAPAN.economy.gdpGrowth.find((r) => r.year === year);
        const gdpCard = $("gdp-year-value");
        if (gdpCard && gdp) gdpCard.textContent = moneyBn(gdp.value);
        const growthCard = $("gdp-year-growth");
        if (growthCard && growth) {
          growthCard.textContent = (growth.value > 0 ? "+" : "") + growth.value.toFixed(1) + "%";
        }
        const capCard = $("gdp-year-capita");
        if (capCard) capCard.textContent = "$" + gdpPerCapita(year).toLocaleString("en-US");
      });
    }
    const donut = $("sector-donut");
    if (donut) {
      donut.innerHTML = donutChart([
        { label: "Services", value: 70.3, color: CHART_COLORS.indigo },
        { label: "Industry", value: 28.7, color: CHART_COLORS.ochre },
        { label: "Agriculture", value: 1.0, color: CHART_COLORS.sage }
      ], { label: "Gross value added by sector, 2024", centerTop: "70.3%", centerBottom: "services" });
    }
    const jobs = $("sector-jobs");
    if (jobs) {
      jobs.innerHTML = hbarChart([
        { label: "Services", value: 73.8 },
        { label: "Industry", value: 23.3 },
        { label: "Agriculture", value: 2.9 }
      ], { label: "Employment by sector, 2024", format: (v) => v.toFixed(1) + "%" });
    }
    const markets = $("export-markets");
    if (markets) {
      markets.innerHTML = hbarChart(JAPAN.economy.tradeGoods.exportMarkets.map((m) => ({
        label: m.partner, value: m.sharePct
      })), { label: "Largest export markets, 2024", format: (v) => v.toFixed(1) + "%" });
    }
    const suppliers = $("import-suppliers");
    if (suppliers) {
      suppliers.innerHTML = hbarChart(JAPAN.economy.tradeGoods.importSuppliers.map((m) => ({
        label: m.partner, value: m.sharePct, color: CHART_COLORS.ochre
      })), { label: "Largest import suppliers, 2024", format: (v) => v.toFixed(1) + "%" });
    }
  }

  // ---- health & education page ----------------------------------------------
  function initHealth() {
    document.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll("[data-tab]").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        document.querySelectorAll("[data-panel]").forEach((panel) => {
          panel.hidden = panel.dataset.panel !== tab;
        });
      });
    });
    const life = $("life-chart");
    if (life) {
      life.innerHTML = hbarChart([
        { label: "Women", value: 87.1, color: CHART_COLORS.red },
        { label: "All", value: 84.0, color: CHART_COLORS.indigo },
        { label: "Men", value: 81.1, color: CHART_COLORS.ochre }
      ], { label: "Life expectancy at birth, years", format: (v) => v.toFixed(1) + " yrs" });
    }
  }

  // ---- regions page -----------------------------------------------------------
  function initRegions() {
    const table = $("prefecture-table");
    if (!table) return;
    const body = table.querySelector("tbody");
    const rows = Array.prototype.slice.call(body.querySelectorAll("tr"));
    const totals = regionTotals();
    let regionFilter = "All";
    let query = "";
    let sortKey = "pop";
    let sortDir = -1;

    function applyFilters() {
      let visible = rows.filter((row) => {
        const matchRegion = regionFilter === "All" || row.dataset.region === regionFilter;
        const matchQuery = !query || row.dataset.name.toLowerCase().includes(query);
        return matchRegion && matchQuery;
      });
      visible.sort((a, b) => {
        if (sortKey === "name" || sortKey === "region") {
          return a.dataset[sortKey].localeCompare(b.dataset[sortKey]) * sortDir;
        }
        const av = Number(a.dataset[sortKey]);
        const bv = Number(b.dataset[sortKey]);
        return (av - bv) * sortDir;
      });
      const hidden = rows.filter((row) => !visible.includes(row));
      visible.forEach((row, i) => {
        row.style.display = "";
        row.querySelector(".rank").textContent = String(i + 1);
        body.appendChild(row);
      });
      hidden.forEach((row) => {
        row.style.display = "none";
        body.appendChild(row);
      });
      const count = $("prefecture-count");
      if (count) {
        count.textContent = visible.length + " of 47 prefectures" +
          (regionFilter === "All" ? "" : " in " + regionFilter);
      }
      const empty = $("prefecture-empty");
      if (empty) empty.style.display = visible.length === 0 ? "" : "none";
    }

    document.querySelectorAll("[data-region-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        regionFilter = btn.dataset.regionFilter;
        document.querySelectorAll("[data-region-filter]").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
        drawRegionChart(regionFilter);
        applyFilters();
      });
    });

    const search = $("prefecture-search");
    if (search) {
      search.addEventListener("input", () => {
        query = search.value.trim().toLowerCase();
        applyFilters();
      });
    }

    table.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (sortKey === key) sortDir = -sortDir;
        else { sortKey = key; sortDir = key === "name" ? 1 : -1; }
        table.querySelectorAll("th[data-sort]").forEach((h) => {
          h.setAttribute("aria-sort", h === th ? (sortDir === 1 ? "ascending" : "descending") : "none");
        });
        applyFilters();
      });
      th.style.cursor = "pointer";
    });

    // Region totals chart, rebuilt when a region is picked.
    function drawRegionChart(region) {
      const host = $("region-chart");
      if (!host) return;
      const bars = REGIONS.map((r) => ({
        label: r, value: totals[r] / 1000,
        color: r === region ? CHART_COLORS.red : CHART_COLORS.indigo
      }));
      host.innerHTML = hbarChart(bars, {
        label: "Population by region, 2024",
        format: (v) => v.toFixed(2) + "m"
      });
    }
    drawRegionChart("All");

    // Compare up to three prefectures.
    const compareHost = $("compare-chart");
    const compareNote = $("compare-note");
    const boxes = Array.prototype.slice.call(document.querySelectorAll("input[data-compare]"));
    boxes.forEach((box) => {
      box.addEventListener("change", () => {
        const picked = boxes.filter((b) => b.checked);
        if (picked.length > 3) {
          box.checked = false;
          if (compareNote) compareNote.textContent = "Compare at most three prefectures — uncheck one first.";
          return;
        }
        if (compareNote) {
          compareNote.textContent = picked.length === 0
            ? "Tick up to three prefectures to compare them."
            : "Comparing " + picked.length + " of 3 prefectures.";
        }
        if (compareHost) {
          if (picked.length === 0) { compareHost.innerHTML = ""; return; }
          compareHost.innerHTML = hbarChart(picked.map((b) => {
            const row = b.closest("tr");
            return { label: b.dataset.compare, value: Number(row.dataset.pop) / 1000 };
          }), { label: "Prefecture comparison, 2024", format: (v) => v.toFixed(2) + "m" });
        }
      });
    });

    // Region cards: population and share, filled from the same figures.
    document.querySelectorAll("[data-region-card]").forEach((card) => {
      const region = card.dataset.regionCard;
      const pop = totals[region] / 1000;
      const popEl = card.querySelector(".region-pop");
      if (popEl) popEl.textContent = pop.toFixed(2) + " million";
      const shareEl = card.querySelector(".region-share");
      if (shareEl) shareEl.textContent = (totals[region] / 123802 * 100).toFixed(1) + "% of Japan";
      const countEl = card.querySelector(".region-count");
      if (countEl) countEl.textContent = prefecturesIn(region).length + " prefectures";
    });

    applyFilters();
  }

  // ---- data page: download every figure as CSV --------------------------------
  function initDataPage() {
    const btn = $("download-csv");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const lines = [["indicator", "value", "unit", "year", "source"]];
      const push = (indicator, value, unit, year, source) => {
        lines.push([indicator, String(value), unit, String(year), source]);
      };
      push("Population", JAPAN.population.latest.value, "persons", 2024, "World Bank WDI");
      push("Population growth", JAPAN.population.growthPct.value, "percent", 2024, "World Bank WDI");
      push("Population density", JAPAN.population.densityPerKm2.value, "per km2", 2024, "World Bank WDI");
      push("Fertility rate", JAPAN.population.fertility.value, "births per woman", 2023, "World Bank WDI");
      push("Births", JAPAN.population.births.value, "persons", 2023, "MHLW Vital Statistics");
      push("Deaths", JAPAN.population.deaths.value, "persons", 2023, "MHLW Vital Statistics");
      for (const row of JAPAN.population.series) {
        push("Population " + row.year, row.value, "million", row.year, "World Bank WDI");
      }
      for (const row of JAPAN.economy.gdpNominal) {
        push("Nominal GDP " + row.year, row.value, "US$ billion", row.year, "World Bank WDI");
      }
      for (const row of JAPAN.economy.gdpGrowth) {
        push("Real GDP growth " + row.year, row.value, "percent", row.year, "IMF WEO");
      }
      push("GDP per capita", JAPAN.economy.gdpPerCapitaUsd.value, "US$", 2024, "World Bank WDI");
      push("Unemployment rate", JAPAN.economy.unemploymentPct.value, "percent", 2024, "World Bank WDI");
      push("Inflation", JAPAN.economy.inflationPct.value, "percent", 2024, "World Bank WDI");
      push("Life expectancy", JAPAN.health.lifeExpectancy.value, "years", 2024, "World Bank WDI");
      push("Infant mortality", JAPAN.health.infantMortalityPer1000.value, "per 1,000 live births", 2024, "World Bank WDI");
      push("Physicians", JAPAN.health.physiciansPer1000.value, "per 1,000 people", 2022, "World Bank WDI");
      push("Hospital beds", JAPAN.health.hospitalBedsPer1000.value, "per 1,000 people", 2022, "OECD");
      for (const p of PREFECTURES) {
        push("Population, " + p.name + " prefecture", p.pop * 1000, "persons", 2024, "Statistics Bureau of Japan");
      }
      const csv = lines.map((row) => row.map((cell) =>
        '"' + cell.replace(/"/g, '""') + '"').join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "nippon-data-atlas-japan-figures.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      const status = $("download-status");
      if (status) status.textContent = "Downloaded " + lines.length + " rows as nippon-data-atlas-japan-figures.csv.";
    });
  }

  // ---- boot --------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    initOverview();
    initPopulation();
    initEconomy();
    initHealth();
    initRegions();
    initDataPage();
    const year = $("site-year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
