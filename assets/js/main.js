/** Renders the soil selector cards on index.html */
(function () {
  function cardHTML(soil) {
    const color = categoricalColor(soil.colorSlot);
    return `
      <article class="soil-card" style="--card-accent:${color}">
        <div class="icon-badge">${soil.icon}</div>
        <span class="order-chip">${soil.order}</span>
        <h3>${soil.name}</h3>
        <div class="region">${soil.region}</div>
        <p class="tagline">${soil.tagline}</p>
        <a class="explore-btn" href="dashboard.html?soil=${soil.slug}">Explore dashboard →</a>
      </article>
    `;
  }

  function render() {
    const grid = document.getElementById("selector-grid");
    grid.innerHTML = SOIL_SAMPLES.map(cardHTML).join("");
  }

  render();
  window.addEventListener("themechange", render);
})();
