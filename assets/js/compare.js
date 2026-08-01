/** Renders the cross-soil comparison chart on compare.html */
(function () {
  const PROPERTIES = [
    { key: "tensileStrength", label: "Tensile Strength", unit: "kPa" },
    { key: "elasticModulus", label: "Elastic Modulus", unit: "MPa" },
    { key: "cohesion", label: "Cohesion", unit: "kPa" },
    { key: "frictionAngle", label: "Internal Friction Angle", unit: "°" },
    { key: "plasticityIndex", label: "Plasticity Index", unit: "" }
  ];

  let chart = null;

  function populateSelect() {
    const select = document.getElementById("property-select");
    select.innerHTML = PROPERTIES.map((p) => `<option value="${p.key}">${p.label}</option>`).join("");
    select.addEventListener("change", () => render(select.value));
  }

  function renderLegend() {
    const legend = document.getElementById("compare-legend");
    legend.innerHTML = SOIL_SAMPLES
      .map(
        (s) => `<span class="legend-item"><span class="swatch" style="background:${categoricalColor(s.colorSlot)}"></span>${s.icon} ${s.name}</span>`
      )
      .join("");
  }

  function render(key) {
    const meta = PROPERTIES.find((p) => p.key === key) || PROPERTIES[0];
    if (chart) chart.destroy();
    chart = renderCompareChart("compare-chart", SOIL_SAMPLES, meta.key, meta);
    renderLegend();
  }

  populateSelect();
  render(PROPERTIES[0].key);

  window.addEventListener("themechange", () => {
    const select = document.getElementById("property-select");
    render(select.value);
  });
})();
