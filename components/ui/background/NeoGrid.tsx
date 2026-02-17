export default function NeoGrid() {
  return (
    <div aria-hidden="true" style={wrap}>
      {/* Minor grid (tipis) */}
      <div style={minorGrid} />

      {/* Major grid (tebal tapi jarang) */}
      <div style={majorGrid} />

      {/* Soft glow */}
      <div style={glow} />

      {/* Very subtle grain */}
      <div style={grain} />
    </div>
  );
}

const wrap: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: -1, // ✅ penting
  pointerEvents: "none",
  background: "#EEF4FF",
};

// ─────────────────────────────────────────────
// GRID TUNING
// ─────────────────────────────────────────────

// Minor grid: rapat, tipis, abu-abu
const minorSize = 32;
const minorLine = 1.4;

const minorGrid: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.18,
  backgroundImage: `
    linear-gradient(to right, rgba(10,10,10,0.35) ${minorLine}px, transparent ${minorLine}px),
    linear-gradient(to bottom, rgba(10,10,10,0.35) ${minorLine}px, transparent ${minorLine}px)
  `,
  backgroundSize: `${minorSize}px ${minorSize}px`,
  backgroundPosition: "0 0",
};

// Major grid: lebih jarang, cyan, sedikit offset shadow via 2 layer gradient
const majorSize = 128;
const majorLine = 2;

const majorGrid: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.22,
  backgroundImage: `
    /* shadow offset */
    linear-gradient(to right, rgba(10,10,10,0.55) ${majorLine}px, transparent ${majorLine}px),
    linear-gradient(to bottom, rgba(10,10,10,0.55) ${majorLine}px, transparent ${majorLine}px),

    /* main cyan */
    linear-gradient(to right, rgba(25,245,227,0.85) ${majorLine}px, transparent ${majorLine}px),
    linear-gradient(to bottom, rgba(25,245,227,0.85) ${majorLine}px, transparent ${majorLine}px)
  `,
  backgroundSize: `
    ${majorSize}px ${majorSize}px,
    ${majorSize}px ${majorSize}px,
    ${majorSize}px ${majorSize}px,
    ${majorSize}px ${majorSize}px
  `,
  backgroundPosition: `
    8px 8px,
    8px 8px,
    0 0,
    0 0
  `,
};

// Glow: lebih soft biar gak “ngeblok” tengah
const glow: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `
    radial-gradient(circle at 52% 42%,
      rgba(25,245,227,0.14) 0%,
      rgba(25,245,227,0.08) 25%,
      rgba(25,245,227,0.03) 55%,
      rgba(25,245,227,0) 100%)
  `,
};

// Grain tipis: nurunin “sterile”, tapi gak bikin noisy
const grainSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="180" height="180" filter="url(#n)" opacity="0.22"/>
</svg>
`);

const grain: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.12,
  // mixBlendMode: "multiply", // ❌ jangan
  backgroundImage: `url("data:image/svg+xml,${grainSvg}")`,
  backgroundRepeat: "repeat",
};
