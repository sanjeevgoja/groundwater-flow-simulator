/** Renders the per-soil research dashboard on dashboard.html */
(function () {
  const PROPERTY_META = {
    tensileStrength: {
      label: "Tensile Strength",
      explain: "The stress the soil can withstand before pulling apart. Low values (peat, loose sand) mean cracks and tension failures form easily; higher values (clay-rich, cemented soils) resist crack propagation but can fail brittlely once exceeded."
    },
    elasticModulus: {
      label: "Elastic Modulus (Young's Modulus)",
      explain: "Stiffness — how much the soil deforms elastically under load. Low modulus soils (peat) settle a great deal under structures; high modulus soils (dense clay hardpan) deform little but can store more strain energy before failure."
    },
    cohesion: {
      label: "Cohesion",
      explain: "Particle-to-particle bonding strength independent of confining pressure — dominated by clay content and moisture. Higher cohesion gives steeper stable slopes and more resistance to erosion once a surface crust is broken."
    },
    frictionAngle: {
      label: "Internal Friction Angle",
      explain: "The resistance to sliding between soil particles, mainly controlled by grain shape and sand/gravel content. Higher friction angles mean better shear strength at low confinement — important for slope stability and pavement subgrades."
    },
    plasticityIndex: {
      label: "Plasticity Index",
      explain: "The moisture-content range over which the soil behaves plastically rather than as a solid or liquid. High plasticity index soils swell and shrink strongly with moisture change — a major driver of foundation movement."
    }
  };

  const charts = [];

  function destroyCharts() {
    charts.forEach((c) => c.destroy());
    charts.length = 0;
  }

  function badge(level) {
    const color = statusColor(level);
    return `<span class="badge" style="background:${color}"><span class="dot"></span>${level}</span>`;
  }

  function picker(current) {
    return SOIL_SAMPLES
      .map((s) => {
        const cls = s.slug === current.slug ? "current" : "";
        const color = categoricalColor(s.colorSlot);
        return `<a class="${cls}" style="${cls ? `background:${color}` : ""}" href="dashboard.html?soil=${s.slug}">${s.icon} ${s.name}</a>`;
      })
      .join("");
  }

  function propertyCard(key, soil) {
    const meta = PROPERTY_META[key];
    const p = soil.properties[key];
    const canvasId = `chart-${key}`;
    return `
      <div class="card property-card">
        <h3>${meta.label}</h3>
        <div class="chart-wrap"><canvas id="${canvasId}"></canvas></div>
        <p>${meta.explain}</p>
      </div>
    `;
  }

  function impactCard(title, icon, impact) {
    return `
      <div class="card impact-card">
        <h3>${icon} ${title} ${badge(impact.level)}</h3>
        <p>${impact.note}</p>
      </div>
    `;
  }

  function dataTable(soil) {
    const rows = Object.entries(soil.properties)
      .map(([key, p]) => `<tr><td>${PROPERTY_META[key].label}</td><td class="num">${p.min}–${p.max} ${p.unit}</td></tr>`)
      .join("");
    const compRows = Object.entries(soil.composition)
      .map(([k, v]) => `<tr><td>${k[0].toUpperCase() + k.slice(1)}</td><td class="num">${v}%</td></tr>`)
      .join("");
    return `
      <details class="data-table">
        <summary>View raw data as a table</summary>
        <table class="plain">
          <thead><tr><th>Composition component</th><th>Value</th></tr></thead>
          <tbody>${compRows}</tbody>
        </table>
        <table class="plain">
          <thead><tr><th>Mechanical property</th><th>Range</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </details>
    `;
  }

  function render() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("soil");
    const soil = getSoilBySlug(slug) || SOIL_SAMPLES[0];
    const color = categoricalColor(soil.colorSlot);

    const root = document.getElementById("dashboard-root");
    root.innerHTML = `
      <section class="soil-hero" style="--soil-accent:${color}">
        <div class="icon-badge-lg">${soil.icon}</div>
        <div class="soil-hero-text">
          <h1>${soil.name}</h1>
          <div class="region">${soil.order} order · ${soil.region}</div>
          <p class="desc">${soil.description}</p>
          <div class="meta-chips">
            <span class="meta-chip">Parent material: ${soil.parentMaterial}</span>
            <span class="meta-chip">Drainage: ${soil.drainage}</span>
          </div>
        </div>
      </section>
      <div class="soil-picker-inline">${picker(soil)}</div>

      <section class="block">
        <h2>Composition</h2>
        <p class="section-lead">Relative proportion of sand, silt, clay and organic matter — the foundation that shapes every mechanical property below.</p>
        <div class="card" style="padding:24px 20px 16px">
          <div class="chart-wrap" style="height:110px"><canvas id="chart-composition"></canvas></div>
        </div>
      </section>

      <section class="block">
        <h2>Tensile, Elastic &amp; Shear Behaviour</h2>
        <p class="section-lead">
          Each chart shows this sample's typical range (solid bar) against the reference band
          observed across all six Alberta samples (light grey), so you can see where this soil
          sits relative to the province-wide spread.
        </p>
        <div class="card-grid">
          ${Object.keys(PROPERTY_META).map((k) => propertyCard(k, soil)).join("")}
        </div>
      </section>

      <section class="block">
        <h2>Impact on the Surrounding Environment</h2>
        <p class="section-lead">How this soil's behaviour plays out for construction, farming, and land stability.</p>
        <div class="card-grid">
          ${impactCard("Construction &amp; Infrastructure", "🏗️", soil.impact.construction)}
          ${impactCard("Agriculture &amp; Land Use", "🌾", soil.impact.agriculture)}
          ${impactCard("Erosion &amp; Environment", "🌬️", soil.impact.erosion)}
        </div>
      </section>

      ${dataTable(soil)}
    `;

    destroyCharts();
    charts.push(renderCompositionChart("chart-composition", soil.composition));
    Object.keys(PROPERTY_META).forEach((key) => {
      const p = soil.properties[key];
      const ref = ALBERTA_REFERENCE_RANGES[key];
      charts.push(
        renderRangeChart(`chart-${key}`, {
          min: p.min,
          max: p.max,
          unit: p.unit || "index",
          color,
          refMin: ref.min,
          refMax: ref.max,
          label: PROPERTY_META[key].label
        })
      );
    });
  }

  render();
  window.addEventListener("themechange", render);
})();
