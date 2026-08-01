/**
 * Chart helpers shared by dashboard.html and compare.html.
 * Uses Chart.js (loaded via CDN in each page) with the validated categorical
 * palette from the dataviz skill — colours are assigned by fixed slot order
 * and never cycled or re-picked per chart.
 */

const PALETTE = {
  light: {
    surface: "#fcfcfb",
    page: "#f9f9f7",
    textPrimary: "#0b0b0b",
    textSecondary: "#52514e",
    muted: "#898781",
    grid: "#e1e0d9",
    baseline: "#c3c2b7"
  },
  dark: {
    surface: "#1a1a19",
    page: "#0d0d0d",
    textPrimary: "#ffffff",
    textSecondary: "#c3c2b7",
    muted: "#898781",
    grid: "#2c2c2a",
    baseline: "#383835"
  },
  categorical: {
    light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"],
    dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"]
  },
  status: {
    good: { light: "#0ca30c", dark: "#0ca30c" },
    warning: { light: "#fab219", dark: "#fab219" },
    serious: { light: "#ec835a", dark: "#ec835a" },
    critical: { light: "#d03b3b", dark: "#d03b3b" }
  }
};

function isDarkMode() {
  const stamp = document.documentElement.getAttribute("data-theme");
  if (stamp === "dark") return true;
  if (stamp === "light") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function chartTheme() {
  return isDarkMode() ? PALETTE.dark : PALETTE.light;
}

function categoricalColor(slot) {
  const mode = isDarkMode() ? "dark" : "light";
  return PALETTE.categorical[mode][slot - 1];
}

function statusColor(level) {
  const key = String(level).toLowerCase();
  const map = { low: "good", excellent: "good", moderate: "warning", good: "warning", high: "serious", fair: "serious", severe: "critical", poor: "critical" };
  const role = map[key] || "warning";
  const mode = isDarkMode() ? "dark" : "light";
  return PALETTE.status[role][mode];
}

function baseChartFont() {
  return { family: "system-ui, -apple-system, 'Segoe UI', sans-serif", size: 12 };
}

/**
 * Horizontal single-bar "range" chart: shows [min, max] for one soil property,
 * with a muted reference band spanning the union range across all six soils
 * for context, and direct value labels at each end (no legend needed — one
 * series, named by the card title above the canvas).
 */
function renderRangeChart(canvasId, { min, max, unit, color, refMin, refMax, label }) {
  const t = chartTheme();
  const ctx = document.getElementById(canvasId).getContext("2d");
  const padding = Math.max((refMax - refMin) * 0.08, 0.5);

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [label || ""],
      datasets: [
        {
          label: "Alberta reference range",
          data: [[refMin, refMax]],
          backgroundColor: t.grid,
          borderRadius: 6,
          barThickness: 22,
          order: 2
        },
        {
          label: "This soil's range",
          data: [[min, max]],
          backgroundColor: color,
          borderRadius: 6,
          barThickness: 12,
          order: 1
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: Math.max(0, refMin - padding),
          max: refMax + padding,
          grid: { color: t.grid },
          ticks: { color: t.muted, font: baseChartFont() },
          title: { display: true, text: unit, color: t.textSecondary, font: baseChartFont() }
        },
        y: { grid: { display: false }, ticks: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const [lo, hi] = item.raw;
              return `${item.dataset.label}: ${lo}–${hi} ${unit}`;
            }
          }
        }
      }
    }
  });
}

/**
 * Single-soil composition bar — one stacked horizontal bar, four segments
 * (sand / silt / clay / organic matter), each a fixed categorical slot so the
 * same component always reads as the same colour across every soil page.
 */
function renderCompositionChart(canvasId, composition) {
  const t = chartTheme();
  const ctx = document.getElementById(canvasId).getContext("2d");
  const parts = [
    { key: "sand", label: "Sand", slot: 1 },
    { key: "silt", label: "Silt", slot: 2 },
    { key: "clay", label: "Clay", slot: 3 },
    { key: "organic", label: "Organic matter", slot: 4 }
  ];

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Composition"],
      datasets: parts.map((p) => ({
        label: p.label,
        data: [composition[p.key]],
        backgroundColor: categoricalColor(p.slot),
        borderColor: t.surface,
        borderWidth: 2,
        borderRadius: 4,
        stack: "composition"
      }))
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 100,
          grid: { color: t.grid },
          ticks: { color: t.muted, font: baseChartFont(), callback: (v) => v + "%" }
        },
        y: { stacked: true, grid: { display: false }, ticks: { display: false } }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: t.textSecondary, font: baseChartFont(), boxWidth: 12, boxHeight: 12, padding: 14 }
        },
        tooltip: {
          callbacks: { label: (item) => `${item.dataset.label}: ${item.raw}%` }
        }
      }
    }
  });
}

/**
 * Cross-soil comparison chart: one horizontal bar per soil for a chosen
 * property, each soil keeping its fixed identity colour (adjacent-pair
 * validated ordering — see references/palette.md).
 */
function renderCompareChart(canvasId, samples, propertyKey, propertyMeta) {
  const t = chartTheme();
  const ctx = document.getElementById(canvasId).getContext("2d");

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: samples.map((s) => s.name),
      datasets: [
        {
          label: propertyMeta.label,
          data: samples.map((s) => [s.properties[propertyKey].min, s.properties[propertyKey].max]),
          backgroundColor: samples.map((s) => categoricalColor(s.colorSlot)),
          borderRadius: 6,
          barThickness: 20
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: t.grid },
          ticks: { color: t.muted, font: baseChartFont() },
          title: { display: true, text: propertyMeta.unit, color: t.textSecondary, font: baseChartFont() }
        },
        y: { grid: { display: false }, ticks: { color: t.textPrimary, font: baseChartFont() } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const [lo, hi] = item.raw;
              return `${lo}–${hi} ${propertyMeta.unit}`;
            }
          }
        }
      }
    }
  });
}
