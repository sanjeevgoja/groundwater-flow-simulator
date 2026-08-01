/**
 * Soil sample data for the Alberta Soil Behaviour Modelling project.
 * Ranges are illustrative, synthesized from published Alberta soil survey
 * characteristics and general geotechnical/agronomic reference ranges for
 * representative soil types. See methodology.html for provenance and caveats.
 *
 * Colour identity: each soil keeps ONE fixed categorical slot (see
 * assets/js/charts.js PALETTE) across every page — selector cards, dashboard
 * bars, and the comparison chart all use the same hue for the same soil.
 */

const SOIL_SAMPLES = [
  {
    slug: "black-chernozem",
    order: "Chernozemic",
    name: "Black Chernozem",
    region: "Central Alberta Parkland (Edmonton–Red Deer corridor)",
    icon: "\u{1F33E}", // sheaf of rice
    colorSlot: 1,
    tagline: "Deep, dark, humus-rich topsoil under aspen parkland grassland.",
    description:
      "Black Chernozems form under moist grassland and parkland vegetation, accumulating a thick, dark A-horizon rich in organic matter. They are the benchmark agricultural soil of Alberta's parkland belt, prized for structure and fertility.",
    parentMaterial: "Glacial till and glaciolacustrine deposits",
    drainage: "Well to moderately well drained",
    composition: { sand: 30, silt: 40, clay: 22, organic: 8 },
    properties: {
      tensileStrength: { min: 15, max: 35, unit: "kPa" },
      elasticModulus: { min: 8, max: 20, unit: "MPa" },
      cohesion: { min: 20, max: 45, unit: "kPa" },
      frictionAngle: { min: 26, max: 32, unit: "°" },
      plasticityIndex: { min: 12, max: 20, unit: "" }
    },
    impact: {
      erosion: { level: "Low", note: "Dense root mat and crumb structure resist both wind and water erosion." },
      construction: { level: "Moderate", note: "Organic-rich topsoil must be stripped before founding; stable clay-loam subsoil below performs well for shallow footings." },
      agriculture: { level: "Excellent", note: "Alberta's premier grain and oilseed soil — high fertility, good moisture holding, easy tillage." }
    }
  },
  {
    slug: "dark-brown-chernozem",
    order: "Chernozemic",
    name: "Dark Brown Chernozem",
    region: "East-Central Alberta dryland belt (Camrose–Coronation)",
    icon: "\u{1F33B}", // sunflower
    colorSlot: 2,
    tagline: "Transitional grassland soil balancing fertility and moisture stress.",
    description:
      "Dark Brown Chernozems occupy the transition between moist parkland and semi-arid grassland. Slightly lower rainfall means less organic accumulation than Black Chernozems, but they remain highly productive dryland farming soils.",
    parentMaterial: "Glacial till",
    drainage: "Well drained",
    composition: { sand: 35, silt: 38, clay: 20, organic: 5 },
    properties: {
      tensileStrength: { min: 10, max: 28, unit: "kPa" },
      elasticModulus: { min: 6, max: 16, unit: "MPa" },
      cohesion: { min: 15, max: 35, unit: "kPa" },
      frictionAngle: { min: 28, max: 34, unit: "°" },
      plasticityIndex: { min: 8, max: 16, unit: "" }
    },
    impact: {
      erosion: { level: "Moderate", note: "Lower vegetative cover in dry years exposes topsoil to wind erosion — a driver of shelterbelt use in the region." },
      construction: { level: "Low", note: "Firm, well-drained subsoil provides reliable bearing capacity for typical rural and low-rise construction." },
      agriculture: { level: "Good", note: "Strong cereal and pulse production; benefits from moisture-conserving tillage practices." }
    }
  },
  {
    slug: "brown-chernozem",
    order: "Chernozemic",
    name: "Brown Chernozem",
    region: "Palliser Triangle, Southeastern Alberta (Medicine Hat–Brooks)",
    icon: "\u{1F335}", // cactus
    colorSlot: 3,
    tagline: "Semi-arid rangeland soil shaped by short grass and low rainfall.",
    description:
      "Brown Chernozems develop under short-grass prairie in Alberta's driest agro-climatic zone. Low organic input and rapid decomposition leave a thinner, lighter-coloured surface horizon suited more to grazing than intensive cropping.",
    parentMaterial: "Glaciolacustrine and glacial till",
    drainage: "Well to excessively drained",
    composition: { sand: 45, silt: 35, clay: 15, organic: 3 },
    properties: {
      tensileStrength: { min: 6, max: 18, unit: "kPa" },
      elasticModulus: { min: 4, max: 12, unit: "MPa" },
      cohesion: { min: 8, max: 22, unit: "kPa" },
      frictionAngle: { min: 30, max: 36, unit: "°" },
      plasticityIndex: { min: 5, max: 12, unit: "" }
    },
    impact: {
      erosion: { level: "High", note: "Sparse cover and coarser texture make this zone Alberta's most wind-erosion-prone cropland; summerfallow amplifies the risk." },
      construction: { level: "Low", note: "Granular, low-plasticity profile gives predictable, low-swell foundation conditions." },
      agriculture: { level: "Fair", note: "Moisture-limited; best suited to drought-tolerant grain varieties and extensive cattle grazing." }
    }
  },
  {
    slug: "gray-luvisol",
    order: "Luvisolic",
    name: "Gray Luvisol",
    region: "Boreal forest, Peace River & northern Alberta",
    icon: "\u{1F332}", // evergreen tree
    colorSlot: 4,
    tagline: "Forest-floor soil with clay accumulation and seasonal wetness.",
    description:
      "Gray Luvisols form under boreal forest cover, where acidic leaf litter leaches clay and minerals from the upper horizon into a denser clay-enriched Bt horizon beneath. They dominate Alberta's forested north and require careful management once cleared for agriculture.",
    parentMaterial: "Glacial till and lacustrine clay",
    drainage: "Imperfectly to moderately well drained",
    composition: { sand: 25, silt: 45, clay: 30, organic: 4 },
    properties: {
      tensileStrength: { min: 18, max: 40, unit: "kPa" },
      elasticModulus: { min: 10, max: 25, unit: "MPa" },
      cohesion: { min: 25, max: 55, unit: "kPa" },
      frictionAngle: { min: 22, max: 28, unit: "°" },
      plasticityIndex: { min: 15, max: 28, unit: "" }
    },
    impact: {
      erosion: { level: "Moderate", note: "Cleared slopes are vulnerable to surface wash and rilling until vegetative cover re-establishes." },
      construction: { level: "High", note: "Seasonal perched water tables and frost-susceptible silt/clay content cause frost heave and drainage challenges for roads and foundations." },
      agriculture: { level: "Good", note: "Productive once limed and fertilized to offset natural acidity; supports forage, canola and cereal production." }
    }
  },
  {
    slug: "solonetzic",
    order: "Solonetzic",
    name: "Solonetzic Soil",
    region: "Southern & Central Alberta saline lowlands",
    icon: "⚠️", // warning sign
    colorSlot: 5,
    tagline: "Sodium-affected clay with a hard, slowly permeable subsoil.",
    description:
      "Solonetzic soils develop where sodium salts accumulate and disperse clay particles, cementing a dense, columnar hardpan (Bnt horizon) below the surface. They present some of Alberta's most demanding conditions for both agriculture and construction.",
    parentMaterial: "Saline glacial till and lacustrine sediments",
    drainage: "Poorly to very poorly drained (subsoil)",
    composition: { sand: 20, silt: 35, clay: 45, organic: 3 },
    properties: {
      tensileStrength: { min: 25, max: 55, unit: "kPa" },
      elasticModulus: { min: 15, max: 35, unit: "MPa" },
      cohesion: { min: 30, max: 70, unit: "kPa" },
      frictionAngle: { min: 18, max: 24, unit: "°" },
      plasticityIndex: { min: 25, max: 45, unit: "" }
    },
    impact: {
      erosion: { level: "Low", note: "Dense hardpan resists erosion, but surface crusting increases runoff and localized ponding." },
      construction: { level: "Severe", note: "High swell-shrink potential and sulphate/sodium content threaten foundations and corrode buried concrete; deep piling or soil replacement is often required." },
      agriculture: { level: "Poor", note: "Sodicity and poor subsoil permeability restrict root penetration and drainage; gypsum amendment and salt-tolerant crops are typical mitigations." }
    }
  },
  {
    slug: "organic-peat",
    order: "Organic",
    name: "Organic / Peat Soil",
    region: "Muskeg wetlands, Northern Alberta lowlands",
    icon: "\u{1F4A7}", // droplet
    colorSlot: 6,
    tagline: "Saturated, carbon-rich wetland soil with very low bearing strength.",
    description:
      "Organic soils (peat/muskeg) accumulate where waterlogged conditions slow decomposition, building deep deposits of partially decayed plant material. They are ecologically vital carbon stores but geotechnically among the most challenging soils to build on.",
    parentMaterial: "Accumulated sedge, moss and woody peat over mineral substrate",
    drainage: "Very poorly drained / permanently saturated",
    composition: { sand: 5, silt: 15, clay: 10, organic: 70 },
    properties: {
      tensileStrength: { min: 2, max: 10, unit: "kPa" },
      elasticModulus: { min: 0.5, max: 3, unit: "MPa" },
      cohesion: { min: 2, max: 10, unit: "kPa" },
      frictionAngle: { min: 15, max: 22, unit: "°" },
      plasticityIndex: { min: 0, max: 15, unit: "" }
    },
    impact: {
      erosion: { level: "Low", note: "Permanent saturation and dense vegetative mat limit erosion, though drainage or disturbance can trigger rapid oxidation and subsidence." },
      construction: { level: "Severe", note: "Very low bearing capacity and large long-term settlement demand preloading, piling, or full peat excavation before construction." },
      agriculture: { level: "Poor", note: "Unproductive undrained; drained peat can be farmed short-term but subsides and oxidizes, releasing stored carbon." }
    }
  }
];

// Union range across all samples per property — used as the grey Alberta
// reference band behind every single-soil range chart, for context.
const ALBERTA_REFERENCE_RANGES = (() => {
  const props = ["tensileStrength", "elasticModulus", "cohesion", "frictionAngle", "plasticityIndex"];
  const out = {};
  props.forEach((p) => {
    const mins = SOIL_SAMPLES.map((s) => s.properties[p].min);
    const maxs = SOIL_SAMPLES.map((s) => s.properties[p].max);
    out[p] = { min: Math.min(...mins), max: Math.max(...maxs), unit: SOIL_SAMPLES[0].properties[p].unit };
  });
  return out;
})();

function getSoilBySlug(slug) {
  return SOIL_SAMPLES.find((s) => s.slug === slug);
}
