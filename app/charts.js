// Nippon Data Atlas — small SVG chart builders, no libraries.
// Every chart is drawn from the figures in data.js. Each builder returns
// an SVG string; app.js drops it into the page and wires the controls.

const CHART_COLORS = {
  ink: "#1c2333",
  red: "#b3261e",
  indigo: "#1f3a5f",
  ochre: "#c98a1b",
  sage: "#5b7a5e",
  grey: "#8a8f98",
  grid: "#e3ddcf"
};

function svgOpen(width, height, label) {
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" role="img" aria-label="' +
    label + '" xmlns="http://www.w3.org/2000/svg">';
}

function niceTicks(min, max, count) {
  const span = max - min;
  const raw = span / count;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / power;
  const step = norm < 1.5 ? power : norm < 3.5 ? 2 * power : norm < 7.5 ? 5 * power : 10 * power;
  const ticks = [];
  let start = Math.ceil(min / step) * step;
  if (start - step >= min - 1e-9) start -= step;
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(v);
  return { ticks, step };
}

// Line chart with dots and value labels. points: [{x: label, y: number}]
function lineChart(points, opts) {
  const width = opts.width || 720;
  const height = opts.height || 300;
  const padL = 58, padR = 16, padT = 18, padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const values = points.map((p) => p.y);
  let min = Math.min.apply(null, values);
  let max = Math.max.apply(null, values);
  if (opts.floor !== undefined) min = Math.min(min, opts.floor);
  if (opts.ceiling !== undefined) max = Math.max(max, opts.ceiling);
  const pad = (max - min) * 0.12 || 1;
  min -= pad;
  max += pad;
  const xAt = (i) => padL + (i / (points.length - 1)) * innerW;
  const yAt = (v) => padT + (1 - (v - min) / (max - min)) * innerH;
  const fmt = opts.format || ((v) => String(v));
  const ticks = niceTicks(min, max, 4).ticks;
  let out = svgOpen(width, height, opts.label || "Line chart");
  for (const t of ticks) {
    const y = yAt(t);
    out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (width - padR) +
      '" y2="' + y.toFixed(1) + '" stroke="' + CHART_COLORS.grid + '" stroke-width="1"/>';
    out += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) +
      '" text-anchor="end" font-size="12" fill="' + CHART_COLORS.grey + '">' + fmt(t) + '</text>';
  }
  const path = points.map((p, i) =>
    (i === 0 ? "M" : "L") + xAt(i).toFixed(1) + "," + yAt(p.y).toFixed(1)).join(" ");
  out += '<path d="' + path + '" fill="none" stroke="' + (opts.color || CHART_COLORS.red) +
    '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
  points.forEach((p, i) => {
    const highlight = opts.highlightIndex === i;
    out += '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(p.y).toFixed(1) +
      '" r="' + (highlight ? 6 : 3.5) + '" fill="' + (highlight ? CHART_COLORS.red : "#fff") +
      '" stroke="' + (opts.color || CHART_COLORS.red) + '" stroke-width="2"/>';
    if (highlight || opts.showAllLabels) {
      out += '<text x="' + xAt(i).toFixed(1) + '" y="' + (yAt(p.y) - 10).toFixed(1) +
        '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CHART_COLORS.ink + '">' +
        fmt(p.y) + '</text>';
    }
    if (i % 2 === 0 || i === points.length - 1) {
      out += '<text x="' + xAt(i).toFixed(1) + '" y="' + (height - 10) +
        '" text-anchor="middle" font-size="12" fill="' + CHART_COLORS.grey + '">' + p.x + '</text>';
    }
  });
  return out + "</svg>";
}

// Vertical bar chart. bars: [{label, value}]
function barChart(bars, opts) {
  const width = opts.width || 720;
  const height = opts.height || 300;
  const padL = 58, padR = 16, padT = 26, padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max.apply(null, bars.map((b) => b.value)) * 1.12;
  const min = opts.floor !== undefined ? opts.floor : 0;
  const slot = innerW / bars.length;
  const barW = Math.min(54, slot * 0.62);
  const yAt = (v) => padT + (1 - (v - min) / (max - min)) * innerH;
  const fmt = opts.format || ((v) => String(v));
  const ticks = niceTicks(min, max, 4).ticks;
  let out = svgOpen(width, height, opts.label || "Bar chart");
  for (const t of ticks) {
    const y = yAt(t);
    out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (width - padR) +
      '" y2="' + y.toFixed(1) + '" stroke="' + CHART_COLORS.grid + '" stroke-width="1"/>';
    out += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) +
      '" text-anchor="end" font-size="12" fill="' + CHART_COLORS.grey + '">' + fmt(t) + '</text>';
  }
  bars.forEach((b, i) => {
    const cx = padL + slot * i + slot / 2;
    const y = yAt(b.value);
    const color = (opts.highlightIndex === i) ? CHART_COLORS.red : (b.color || opts.color || CHART_COLORS.indigo);
    out += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + y.toFixed(1) +
      '" width="' + barW.toFixed(1) + '" height="' + (padT + innerH - y).toFixed(1) +
      '" rx="3" fill="' + color + '"/>';
    out += '<text x="' + cx.toFixed(1) + '" y="' + (y - 7).toFixed(1) +
      '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CHART_COLORS.ink + '">' +
      fmt(b.value) + '</text>';
    out += '<text x="' + cx.toFixed(1) + '" y="' + (height - 10) +
      '" text-anchor="middle" font-size="12" fill="' + CHART_COLORS.grey + '">' + b.label + '</text>';
  });
  return out + "</svg>";
}

// Horizontal bar chart, best for ranked lists. bars: [{label, value}]
function hbarChart(bars, opts) {
  const rowH = opts.rowHeight || 30;
  const width = opts.width || 720;
  const padL = opts.labelWidth || 110, padR = 64, padT = 8;
  const height = padT + bars.length * rowH + 8;
  const max = Math.max.apply(null, bars.map((b) => b.value)) * 1.05;
  const innerW = width - padL - padR;
  const fmt = opts.format || ((v) => String(v));
  let out = svgOpen(width, height, opts.label || "Horizontal bar chart");
  bars.forEach((b, i) => {
    const y = padT + i * rowH;
    const w = (b.value / max) * innerW;
    const color = (opts.highlightIndex === i) ? CHART_COLORS.red : (b.color || opts.color || CHART_COLORS.indigo);
    out += '<text x="' + (padL - 8) + '" y="' + (y + 17) +
      '" text-anchor="end" font-size="13" fill="' + CHART_COLORS.ink + '">' + b.label + '</text>';
    out += '<rect x="' + padL + '" y="' + (y + 5) + '" width="' + Math.max(w, 2).toFixed(1) +
      '" height="16" rx="3" fill="' + color + '"/>';
    out += '<text x="' + (padL + w + 8).toFixed(1) + '" y="' + (y + 18) +
      '" font-size="12" font-weight="700" fill="' + CHART_COLORS.ink + '">' + fmt(b.value) + '</text>';
  });
  return out + "</svg>";
}

// Stacked 100% bar for age structure. parts: [{label, value, color}]
function stackedBar(parts, opts) {
  const width = opts.width || 720;
  const height = opts.height || 64;
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  let x = 0;
  let out = svgOpen(width, height, opts.label || "Stacked bar");
  for (const p of parts) {
    const w = (p.value / total) * width;
    out += '<rect x="' + x.toFixed(1) + '" y="8" width="' + w.toFixed(1) +
      '" height="26" fill="' + p.color + '"/>';
    x += w;
  }
  let lx = 0;
  for (const p of parts) {
    const w = (p.value / total) * width;
    const mid = lx + w / 2;
    out += '<text x="' + mid.toFixed(1) + '" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="' +
      CHART_COLORS.ink + '">' + p.label + " " + p.value.toFixed(1) + '%</text>';
    lx += w;
  }
  return out + "</svg>";
}

// Simple donut for sector shares. parts: [{label, value, color}]
function donutChart(parts, opts) {
  const size = opts.size || 220;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, hole = r - 34;
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  let angle = -Math.PI / 2;
  let out = svgOpen(size, size, opts.label || "Donut chart");
  for (const p of parts) {
    const sweep = (p.value / total) * Math.PI * 2;
    const large = sweep > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + sweep), y2 = cy + r * Math.sin(angle + sweep);
    const xi1 = cx + hole * Math.cos(angle + sweep), yi1 = cy + hole * Math.sin(angle + sweep);
    const xi2 = cx + hole * Math.cos(angle), yi2 = cy + hole * Math.sin(angle);
    out += '<path d="M' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large +
      ' 1 ' + x2.toFixed(1) + ',' + y2.toFixed(1) + ' L' + xi1.toFixed(1) + ',' + yi1.toFixed(1) +
      ' A' + hole + ',' + hole + ' 0 ' + large + ' 0 ' + xi2.toFixed(1) + ',' + yi2.toFixed(1) +
      ' Z" fill="' + p.color + '"/>';
    angle += sweep;
  }
  out += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="22" font-weight="700" fill="' +
    CHART_COLORS.ink + '">' + opts.centerTop + '</text>';
  out += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="12" fill="' +
    CHART_COLORS.grey + '">' + opts.centerBottom + '</text>';
  return out + "</svg>";
}
