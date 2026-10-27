/* ============================================================
   illus.js
   Original SVG drawings for the weekly size comparison.
   Nothing here is copied from anywhere. Shapes are built from
   a small vocabulary so all forty weeks look like one family.

   Each entry: shape, colour, how big it draws, plus accents.
   `grow` runs 0 to 1 so the drawing literally grows week by week.
   ============================================================ */

const ART = {
  /* ---- tiny, first weeks ---- */
  "poppy seed":   { shape: "oval",     fill: "#6E5C47", grow: .05 },
  "sesame seed":  { shape: "oval",     fill: "#C9B188", grow: .07, slim: .55 },
  "lentil":       { shape: "round",    fill: "#B08455", grow: .09 },
  "blueberry":    { shape: "round",    fill: "#5A6B8C", grow: .12, crown: true },
  "kidney bean":  { shape: "kidney",   fill: "#8E5540", grow: .15 },
  "grape":        { shape: "round",    fill: "#7B6090", grow: .18, stem: true },
  "kumquat":      { shape: "oval",     fill: "#D98A3C", grow: .21, leaf: true },
  "fig":          { shape: "teardrop", fill: "#7A5370", grow: .25, stem: true },
  "lime":         { shape: "round",    fill: "#7FA05A", grow: .28, segments: true },
  "pea pod":      { shape: "pod",      fill: "#7FA05A", grow: .32 },
  "lemon":        { shape: "oval",     fill: "#D9B646", grow: .34, nib: true },
  "orange":       { shape: "round",    fill: "#D98A3C", grow: .37, leaf: true, segments: true },
  "avocado":      { shape: "teardrop", fill: "#6E8B52", grow: .40, pit: true },
  "pomegranate":  { shape: "round",    fill: "#A64B52", grow: .43, crown: true, seeds: true },
  "bell pepper":  { shape: "pepper",   fill: "#C2622F", grow: .46, crown: true },
  "mango":        { shape: "oval",     fill: "#D9903C", grow: .49, tilt: -18 },
  "banana":       { shape: "crescent", fill: "#D9BE4B", grow: .52 },
  "carrot":       { shape: "cone",     fill: "#C96A2E", grow: .54, tops: true },
  "papaya":       { shape: "oval",     fill: "#C97A46", grow: .57, slim: .62, tilt: -12 },
  "grapefruit":   { shape: "round",    fill: "#C9715E", grow: .59, segments: true },
  "ear of corn":  { shape: "cob",      fill: "#D9C055", grow: .62 },
  "cauliflower":  { shape: "floret",   fill: "#E2DCC4", grow: .65 },
  "head of lettuce": { shape: "floret", fill: "#8CA66A", grow: .67 },
  "cucumber":     { shape: "long",     fill: "#6E8B52", grow: .69 },
  "aubergine":    { shape: "teardrop", fill: "#5E4668", grow: .72, crown: true, flip: true },
  "butternut squash": { shape: "gourd", fill: "#D9A95C", grow: .74 },
  "cabbage":      { shape: "floret",   fill: "#9FB37E", grow: .77 },
  "coconut":      { shape: "round",    fill: "#8A6B4F", grow: .79, hairs: true },
  "squash":       { shape: "gourd",    fill: "#C9A040", grow: .81 },
  "pineapple":    { shape: "pineapple", fill: "#D9A83C", grow: .84 },
  "cantaloupe":   { shape: "round",    fill: "#C9A878", grow: .86, netting: true },
  "honeydew melon": { shape: "round",  fill: "#C6CE94", grow: .88 },
  "romaine lettuce": { shape: "pod",   fill: "#8CA66A", grow: .90 },
  "winter melon": { shape: "oval",     fill: "#8FA882", grow: .93, slim: .78 },
  "leek":         { shape: "long",     fill: "#A8BE86", grow: .95 },
  "small watermelon": { shape: "round", fill: "#5E7A48", grow: .97, stripes: true },
  "pumpkin":      { shape: "pumpkin",  fill: "#C9742E", grow: 1 }
};

/* "About the size of an orange." -> "orange" */
function keyOf(phrase) {
  return String(phrase || "")
    .replace(/^an?\s+/i, "")
    .replace(/\.$/, "")
    .trim()
    .toLowerCase();
}

const DARK = {                      // a deeper tone for shading
  "#6E5C47": "#584931", "#C9B188": "#B09768", "#B08455": "#8F673E",
  "#5A6B8C": "#44536F", "#8E5540": "#6F4030", "#7B6090": "#5F4873",
  "#D98A3C": "#B86F28", "#7A5370": "#5E3E57", "#7FA05A": "#618043",
  "#D9B646": "#BA9A2E", "#6E8B52": "#556E3E", "#A64B52": "#85383E",
  "#C2622F": "#9E4C21", "#D9903C": "#B87628", "#D9BE4B": "#BBA134",
  "#C96A2E": "#A5521F", "#C97A46": "#A55F33", "#C9715E": "#A55748",
  "#D9C055": "#BBA33D", "#E2DCC4": "#C9C2A6", "#8CA66A": "#6F8750",
  "#5E4668": "#473352", "#D9A95C": "#BA8B41", "#9FB37E": "#819562",
  "#8A6B4F": "#6B5139", "#C9A040": "#A8832C", "#D9A83C": "#BA8A28",
  "#C9A878": "#A98A5C", "#C6CE94": "#A7B075", "#8FA882": "#718A66",
  "#A8BE86": "#8AA068", "#5E7A48": "#466034", "#C9742E": "#A45A1E"
};

const LEAF = "#6E8B52", LEAF_D = "#556E3E", STEM = "#7A6248";

/* ---- the shape vocabulary ------------------------------- */

function build(a, s) {
  const d = DARK[a.fill] || a.fill;
  const cy = 58;
  let g = "";

  switch (a.shape) {

    case "round":
      g += `<circle cx="50" cy="${cy}" r="${s}" fill="${a.fill}"/>`;
      g += `<path d="M${50 - s * .62} ${cy - s * .5} a${s * .66} ${s * .66} 0 0 1 ${s * .8} ${-s * .2}"
             stroke="#fff" stroke-opacity=".3" stroke-width="${s * .14}"
             stroke-linecap="round" fill="none"/>`;
      if (a.segments)
        for (let i = 0; i < 6; i++)
          g += `<line x1="50" y1="${cy}" x2="${50 + s * .82 * Math.cos(i * Math.PI / 3)}"
                 y2="${cy + s * .82 * Math.sin(i * Math.PI / 3)}"
                 stroke="${d}" stroke-opacity=".45" stroke-width="${Math.max(.6, s * .05)}"/>`;
      if (a.stripes) {
        const cid = "wm" + Math.round(s * 100);
        g += `<clipPath id="${cid}"><circle cx="50" cy="${cy}" r="${s}"/></clipPath>
              <g clip-path="url(#${cid})">`;
        for (let i = -2; i <= 2; i++)
          g += `<path d="M${50 + i * s * .38} ${cy - s * 1.1} q${s * .22} ${s * 1.1} 0 ${s * 2.2}"
                 stroke="${d}" stroke-width="${s * .13}" fill="none" stroke-opacity=".75"/>`;
        g += `</g>`;
      }
      if (a.netting)
        for (let i = -1; i <= 1; i++)
          g += `<path d="M${50 - s * .85} ${cy + i * s * .45} q${s * .85} ${-s * .22} ${s * 1.7} 0"
                 stroke="#fff" stroke-opacity=".35" stroke-width="${s * .06}" fill="none"/>`;
      if (a.seeds)
        [[-.35, -.1], [.3, -.25], [0, .25], [-.15, .45], [.4, .2]].forEach(([x, y]) =>
          g += `<circle cx="${50 + x * s}" cy="${cy + y * s}" r="${s * .1}"
                 fill="#fff" fill-opacity=".45"/>`);
      if (a.hairs) {
        [[-.17, -.4], [.17, -.4], [0, -.17]].forEach(([x, y]) =>
          g += `<circle cx="${50 + x * s}" cy="${cy + y * s}" r="${s * .08}" fill="${d}"/>`);
        for (let i = -1; i <= 1; i++)
          g += `<path d="M${50 - s * .78} ${cy + i * s * .42 + s * .1}
                 q${s * .78} ${-s * .18} ${s * 1.56} 0"
                 stroke="${d}" stroke-opacity=".3" stroke-width="${s * .05}" fill="none"/>`;
      }
      break;

    case "oval": {
      const rx = s * (a.slim || .78), ry = s;
      g += `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${a.fill}"/>`;
      g += `<ellipse cx="${50 - rx * .3}" cy="${cy - ry * .35}" rx="${rx * .3}" ry="${ry * .2}"
             fill="#fff" fill-opacity=".25"/>`;
      if (a.nib) {
        g += `<path d="M50 ${cy - ry} l0 ${-s * .14}" stroke="${d}"
               stroke-width="${s * .12}" stroke-linecap="round"/>`;
        g += `<path d="M50 ${cy + ry} l0 ${s * .14}" stroke="${d}"
               stroke-width="${s * .12}" stroke-linecap="round"/>`;
      }
      break;
    }

    case "teardrop": {
      const w = s * .8, h = s * 1.05;
      const top = a.flip ? cy + h : cy - h;
      const bot = a.flip ? cy - h * .9 : cy + h * .9;
      g += `<path d="M50 ${top}
             C${50 + w * .55} ${top + (a.flip ? -h * .5 : h * .5)}
              ${50 + w} ${bot - (a.flip ? -h * .4 : h * .4)}
              50 ${bot}
             C${50 - w} ${bot - (a.flip ? -h * .4 : h * .4)}
              ${50 - w * .55} ${top + (a.flip ? -h * .5 : h * .5)}
              50 ${top} Z" fill="${a.fill}"/>`;
      g += `<ellipse cx="${50 - w * .3}" cy="${cy + h * .15}" rx="${w * .22}" ry="${h * .2}"
             fill="#fff" fill-opacity=".2"/>`;
      if (a.pit)
        g += `<circle cx="50" cy="${cy + h * .22}" r="${s * .26}" fill="${d}"/>`;
      break;
    }

    case "kidney":
      g += `<path d="M${50 - s * .85} ${cy - s * .2}
             q${s * .25} ${-s * .75} ${s * .95} ${-s * .5}
             q${s * .85} ${s * .3} ${s * .6} ${s * .85}
             q${-s * .3} ${s * .7} ${-s * 1.1} ${s * .4}
             q${-s * .65} ${-s * .25} ${-s * .45} ${-s * .75} Z"
             fill="${a.fill}"/>`;
      break;

    case "crescent": {
      const x1 = 50 - s * .72, y1 = cy - s * .78;
      const x2 = 50 + s * .82, y2 = cy + s * .52;
      g += `<path d="M${x1} ${y1}
             Q${50 - s * 1.02} ${cy + s * .95} ${x2} ${y2}
             Q${50 - s * .3} ${cy + s * .34} ${x1} ${y1} Z"
             fill="${a.fill}" stroke="${a.fill}" stroke-width="${s * .16}"
             stroke-linejoin="round"/>`;
      g += `<path d="M${x1 + s * .1} ${y1 + s * .18}
             Q${50 - s * .72} ${cy + s * .64} ${x2 - s * .16} ${y2 - s * .1}"
             stroke="#fff" stroke-opacity=".28" stroke-width="${s * .1}"
             fill="none" stroke-linecap="round"/>`;
      g += `<circle cx="${x1}" cy="${y1}" r="${s * .09}" fill="${d}"/>`;
      break;
    }

    case "cone":
      g += `<path d="M50 ${cy + s * 1.05}
             L${50 - s * .42} ${cy - s * .75}
             q${s * .42} ${-s * .22} ${s * .84} 0 Z" fill="${a.fill}"/>`;
      for (let i = 1; i < 4; i++)
        g += `<line x1="${50 - s * .3 + i * s * .03}" y1="${cy - s * .4 + i * s * .38}"
               x2="${50 + s * .3 - i * s * .03}" y2="${cy - s * .5 + i * s * .38}"
               stroke="${d}" stroke-opacity=".5" stroke-width="${s * .05}"/>`;
      if (a.tops)
        g += `<path d="M50 ${cy - s * .78} l${-s * .3} ${-s * .4} M50 ${cy - s * .78} l0 ${-s * .5}
               M50 ${cy - s * .78} l${s * .3} ${-s * .4}"
               stroke="${LEAF}" stroke-width="${s * .1}" stroke-linecap="round" fill="none"/>`;
      break;

    case "long": {
      const w = s * .42, h = s * 1.05;
      g += `<rect x="${50 - w}" y="${cy - h}" width="${w * 2}" height="${h * 2}"
             rx="${w}" fill="${a.fill}"/>`;
      g += `<rect x="${50 - w * .5}" y="${cy - h * .7}" width="${w * .4}" height="${h * 1.2}"
             rx="${w * .2}" fill="#fff" fill-opacity=".22"/>`;
      break;
    }

    case "pod":
      g += `<path d="M50 ${cy - s}
             Q${50 + s * .92} ${cy} 50 ${cy + s}
             Q${50 - s * .92} ${cy} 50 ${cy - s} Z" fill="${a.fill}"/>`;
      g += `<path d="M50 ${cy - s} Q${50 + s * .5} ${cy} 50 ${cy + s}"
             stroke="${d}" stroke-opacity=".45" stroke-width="${s * .055}" fill="none"/>`;
      [-.42, 0, .42].forEach(y =>
        g += `<circle cx="50" cy="${cy + y * s}" r="${s * .17}"
               fill="${d}" fill-opacity=".5"/>`);
      break;

    case "pepper": {
      const w = s * .92;
      g += `<path d="M50 ${cy - s * .66}
             C${50 + w} ${cy - s * .66} ${50 + w} ${cy + s * .4} ${50 + w * .62} ${cy + s * .78}
             C${50 + w * .4} ${cy + s * .98} ${50 + w * .28} ${cy + s * .58} ${50 + w * .17} ${cy + s * .72}
             C${50 + w * .06} ${cy + s * .9} ${50 - w * .06} ${cy + s * .9} ${50 - w * .17} ${cy + s * .72}
             C${50 - w * .28} ${cy + s * .58} ${50 - w * .4} ${cy + s * .98} ${50 - w * .62} ${cy + s * .78}
             C${50 - w} ${cy + s * .4} ${50 - w} ${cy - s * .66} 50 ${cy - s * .66} Z"
             fill="${a.fill}"/>`;
      g += `<path d="M${50 - w * .55} ${cy - s * .3} q${s * .14} ${s * .5} 0 ${s * .9}"
             stroke="#fff" stroke-opacity=".22" stroke-width="${s * .1}" fill="none"/>`;
      break;
    }

    case "gourd":
      g += `<ellipse cx="50" cy="${cy + s * .45}" rx="${s * .62}" ry="${s * .58}" fill="${a.fill}"/>`;
      g += `<path d="M${50 - s * .26} ${cy + s * .45}
             q0 ${-s * .95} ${s * .26} ${-s * 1.2}
             q${s * .26} ${s * .25} ${s * .26} ${s * 1.2} Z" fill="${a.fill}"/>`;
      g += `<path d="M50 ${cy - s * .76} l0 ${-s * .22}" stroke="${STEM}"
             stroke-width="${s * .12}" stroke-linecap="round"/>`;
      break;

    case "cob":
      g += `<ellipse cx="50" cy="${cy}" rx="${s * .42}" ry="${s * 1.02}" fill="${a.fill}"/>`;
      for (let r = -3; r <= 3; r++)
        for (let c = -1; c <= 1; c++)
          g += `<circle cx="${50 + c * s * .22}" cy="${cy + r * s * .24}" r="${s * .085}"
                 fill="${DARK[a.fill]}" fill-opacity=".35"/>`;
      g += `<path d="M${50 - s * .4} ${cy + s * .3} q${-s * .45} ${s * .5} ${-s * .1} ${s * .85}
             q${s * .4} ${-s * .2} ${s * .5} ${-s * .75} Z" fill="${LEAF}"/>`;
      g += `<path d="M${50 + s * .4} ${cy + s * .3} q${s * .45} ${s * .5} ${s * .1} ${s * .85}
             q${-s * .4} ${-s * .2} ${-s * .5} ${-s * .75} Z" fill="${LEAF_D}"/>`;
      break;

    case "floret": {
      const r = s * .82;
      [[0, -.42], [-.46, -.1], [.46, -.1], [-.26, .3], [.26, .3]].forEach(([x, y], i) =>
        g += `<circle cx="${50 + x * r}" cy="${cy + y * r}" r="${r * (i === 0 ? .58 : .5)}"
               fill="${i % 2 ? a.fill : DARK[a.fill]}" fill-opacity="${i % 2 ? 1 : .85}"/>`);
      g += `<path d="M${50 - r * .8} ${cy + r * .5} q${r * .8} ${r * .45} ${r * 1.6} 0"
             stroke="${LEAF_D}" stroke-width="${r * .22}" fill="none" stroke-linecap="round"/>`;
      break;
    }

    case "pineapple": {
      const pid = "pa" + Math.round(s * 100);
      g += `<ellipse cx="50" cy="${cy + s * .25}" rx="${s * .58}" ry="${s * .8}" fill="${a.fill}"/>`;
      g += `<clipPath id="${pid}"><ellipse cx="50" cy="${cy + s * .25}"
             rx="${s * .58}" ry="${s * .8}"/></clipPath><g clip-path="url(#${pid})">`;
      for (let r = -2; r <= 2; r++)
        for (let c = -1; c <= 1; c++)
          g += `<path d="M${50 + c * s * .3} ${cy + s * .25 + r * s * .3}
                 l${s * .13} ${s * .13} l${-s * .13} ${s * .13} l${-s * .13} ${-s * .13} Z"
                 fill="${DARK[a.fill]}" fill-opacity=".5"/>`;
      g += `</g>`;
      [[-.34, -.34], [-.14, -.16], [.04, .02], [.2, .2], [.36, .38]].forEach(([x, lean], i) =>
        g += `<path d="M${50 + x * s - s * .13} ${cy - s * .4}
               Q${50 + (x + lean * .4) * s} ${cy - s * .95}
                ${50 + (x + lean) * s} ${cy - s * 1.3}
               Q${50 + (x + lean * .35) * s + s * .14} ${cy - s * .9}
                ${50 + x * s + s * .18} ${cy - s * .4} Z"
               fill="${i % 2 ? LEAF : LEAF_D}"/>`);
      break;
    }

    case "pumpkin":
      const kid = "pk" + Math.round(s * 100);
      g += `<ellipse cx="50" cy="${cy + s * .1}" rx="${s * .98}" ry="${s * .8}" fill="${a.fill}"/>`;
      g += `<clipPath id="${kid}"><ellipse cx="50" cy="${cy + s * .1}"
             rx="${s * .98}" ry="${s * .8}"/></clipPath><g clip-path="url(#${kid})">`;
      [-.6, -.2, .2, .6].forEach(x =>
        g += `<path d="M${50 + x * s} ${cy - s * .78} q${s * .18} ${s * .88} 0 ${s * 1.76}"
               stroke="${DARK[a.fill]}" stroke-opacity=".55" stroke-width="${s * .07}" fill="none"/>`);
      g += `</g>`;
      g += `<path d="M50 ${cy - s * .72} l0 ${-s * .24}" stroke="${STEM}"
             stroke-width="${s * .16}" stroke-linecap="round"/>`;
      break;
  }

  /* ---- shared accents ---- */
  if (a.stem)
    g += `<path d="M50 ${cy - s * (a.shape === "round" ? 1 : .95)} l0 ${-s * .26}"
           stroke="${STEM}" stroke-width="${Math.max(1, s * .11)}" stroke-linecap="round"/>`;
  if (a.crown)
    g += `<path d="M50 ${cy - s * .95} l${-s * .22} ${-s * .3} M50 ${cy - s * .95} l0 ${-s * .36}
           M50 ${cy - s * .95} l${s * .22} ${-s * .3}"
           stroke="${LEAF_D}" stroke-width="${Math.max(1, s * .09)}"
           stroke-linecap="round" fill="none"/>`;
  if (a.leaf)
    g += `<path d="M${50 + s * .06} ${cy - s * .98}
           q${s * .5} ${-s * .4} ${s * .72} ${-s * .04}
           q${-s * .4} ${s * .3} ${-s * .72} ${s * .04} Z" fill="${LEAF}"/>`;

  return g;
}

/* ---- public: an <svg> string for a size phrase ----------- */
export function sizeArt(phrase, px = 150) {
  const a = ART[keyOf(phrase)];
  if (!a) return "";
  const s = 10 + a.grow * 30;              // the drawing grows week by week
  const tilt = a.tilt ? ` transform="rotate(${a.tilt} 50 58)"` : "";
  return `<svg viewBox="0 0 100 100" width="${px}" height="${px}"
            role="img" aria-label="${keyOf(phrase)}"
            xmlns="http://www.w3.org/2000/svg"><g${tilt}>${build(a, s)}</g></svg>`;
}

export function hasArt(phrase) { return !!ART[keyOf(phrase)]; }
