// The "living geometry" of the Ebda AI Studio family, drawn at build time as tiling SVG files (one lattice per sub-brand).
// Same construction as the studio home's girih (8-fold star family), plus two siblings:
//   marketing: 8-point stars with turned squares (silver/platinum lead)
//   design:    octagons and squares, the classic floor-tile lattice (brass)
//   events:    12-point stars on a triangular lattice (Ebda gold lead)
// No {6/2} star (two overlapping triangles) anywhere: Ruling MKT-NO-HEXAGRAM-1, guarded by test/sites.test.mjs.
const f = n => String(Math.round(n * 10) / 10);
const poly = pts => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;
const ring = (n, r, rot = 0) => Array.from({ length: n }, (_, k) => [Math.cos(rot + (k * 2 * Math.PI) / n) * r, Math.sin(rot + (k * 2 * Math.PI) / n) * r]);
const starPts = (n, rOut, rIn) =>
  Array.from({ length: 2 * n }, (_, k) => {
    const a = (k * Math.PI) / n;
    const r = k % 2 ? rIn : rOut;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });

// 8-fold star with long diagonal tips (the studio's star8), its inner star and the turned square between stars.
const star8 = s =>
  poly(Array.from({ length: 16 }, (_, k) => {
    const a = (k * Math.PI) / 8;
    const r = k % 2 ? 0.29 * s : k % 4 === 0 ? 0.62 * s : 0.707 * s;
    return [Math.cos(a) * r, Math.sin(a) * r];
  }));
const inner8 = s => poly(starPts(8, 0.3 * s, 0.14 * s));
const diamond = s => poly([[0.38 * s, 0], [0, 0.38 * s], [-0.38 * s, 0], [0, -0.38 * s]]);
const star12 = s => poly(starPts(12, 0.5 * s, 0.3 * s));
const inner12 = s => poly(starPts(12, 0.22 * s, 0.12 * s));

const COLORS = {
  gold: '176,141,87',
  brass: '138,106,54',
  silver: '125,133,141',
};
const stroke = (c, o) => `fill="none" stroke="rgb(${COLORS[c]})" stroke-opacity="${o}" stroke-width="1" stroke-linejoin="round"`;
const at = (x, y, d, c, o) => `<path transform="translate(${f(x)} ${f(y)})" d="${d}" ${stroke(c, o)}/>`;

function marketing(s = 64) {
  const T = 2 * s;
  const out = [];
  for (let i = -1; i <= 2; i++)
    for (let j = -1; j <= 2; j++) {
      const x = (i + 0.5) * s;
      const y = (j + 0.5) * s;
      if (x + 0.71 * s < 0 || x - 0.71 * s > T || y + 0.71 * s < 0 || y - 0.71 * s > T) continue;
      if ((i + j) % 2 === 0) out.push(at(x, y, star8(s), 'silver', 0.6), at(x, y, inner8(s), 'gold', 0.42));
      else out.push(at(x, y, diamond(s), 'silver', 0.4));
    }
  return { w: T, h: T, body: out.join('') };
}

function design(s = 64) {
  // regular octagons of width s on a square grid touch along their axis edges; the gaps are turned squares
  const r = s / 2 / Math.cos(Math.PI / 8);
  const oct = poly(ring(8, r, Math.PI / 8));
  const inner = poly(ring(8, r * 0.55, 0));
  const out = [];
  for (const [x, y] of [[0, 0], [s, 0], [0, s], [s, s]]) out.push(at(x, y, oct, 'brass', 0.4), at(x, y, inner, 'gold', 0.34));
  // the square in the gap at the cell centre, with a small cross-plank
  const g = (s - 2 * r * Math.sin(Math.PI / 8)) / 2;
  out.push(at(s / 2, s / 2, poly([[g * 0.55, 0], [0, g * 0.55], [-g * 0.55, 0], [0, -g * 0.55]]), 'silver', 0.5));
  return { w: s, h: s, body: out.join('') };
}

function events(s = 72) {
  const H = Math.sqrt(3) * s;
  const pts = [[0, 0], [s, 0], [0, H], [s, H], [s / 2, H / 2], [s / 2, -H / 2], [s / 2, (3 * H) / 2]];
  const out = [];
  for (const [x, y] of pts) out.push(at(x, y, star12(s), 'gold', 0.45), at(x, y, inner12(s), 'silver', 0.4));
  return { w: s, h: H, body: out.join('') };
}

const LATTICE = { marketing, design, events };

/** One seamless tile of the sub-brand's lattice, as a standalone SVG file (served as a CSS background). */
export function latticeSvg(id) {
  const { w, h, body } = LATTICE[id]();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${f(w)}" height="${f(h)}" viewBox="0 0 ${f(w)} ${f(h)}">${body}</svg>\n`;
}

/** The single motif of the lattice, used as a small medallion beside section labels. */
export function medalSvg(id) {
  const d = { marketing: [star8(40), inner8(40)], design: [poly(ring(8, 20 / Math.cos(Math.PI / 8), Math.PI / 8)), poly(ring(8, 11, 0))], events: [star12(56), inner12(56)] }[id];
  const c = { marketing: ['silver', 'gold'], design: ['brass', 'gold'], events: ['gold', 'silver'] }[id];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-30 -30 60 60">${d.map((p, i) => `<path d="${p}" ${stroke(c[i], 0.95).replace('stroke-width="1"', 'stroke-width="1.6"')}/>`).join('')}</svg>\n`;
}
