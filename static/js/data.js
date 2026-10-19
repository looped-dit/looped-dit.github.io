/* Looped-DiT project page: every number shown on the page.
   Tables are transcribed from the paper (arXiv 2609.40305). Curves are the plotted values of the paper's
   figures (read from the vector PDFs); where a figure and a table disagree, the table is used. */
window.LD = {
  /* Table 1: comparison with state-of-the-art T2I models (B/16, loop x4, 100 Euler steps, CFG 6.0) */
  main: {
    cols: ['GenEval', 'DPG', 'PRISM', 'CoRe', 'Spatial', 'TIIF-Short', 'Average'],
    groups: [
      { name: 'Non-CoT models', rows: [
        ['E-MMDiT', 0.30, [69.1, 80.4, 51.6, 30.7, 45.7, 63.4, 56.8]],
        ['SANA-0.6B', 0.59, [65.8, 83.3, 56.4, 39.8, 47.4, 69.4, 60.4]],
        ['DeCo-XXL/16', 1.1, [82.0, 82.0, 52.6, 34.8, 49.8, 70.4, 61.9]],
        ['URSA-0.6B', 0.86, [64.1, 85.6, 59.6, 43.4, 52.0, 67.6, 62.1]],
        ['TiM-T2I', 0.87, [82.8, 83.2, 51.4, 36.7, 48.2, 70.6, 62.2]],
        ['DreamLite', 0.39, [71.6, 85.2, 55.5, 42.2, 53.9, 72.6, 63.5]],
        ['CogView4', 6.4, [73.0, 85.1, 60.9, 45.0, 53.3, 66.9, 64.0]],
        ['MiniT2I-B/16', 0.26, [87.5, 84.1, 55.6, 44.0, 52.0, 75.0, 66.4]],
        ['MiniT2I-L/16', 0.91, [88.3, 84.8, 58.9, 44.4, 52.2, 75.0, 67.3]],
        ['UniLIP-3B', 1.6, [90.3, 83.4, 58.5, 45.0, 51.6, 78.2, 67.8]],
        ['InternVL-U', 1.7, [85.0, 85.2, 63.5, 48.2, 54.5, 77.7, 69.0]]
      ]},
      { name: 'CoT-reasoning models', rows: [
        ['GoT-R1', 6.9, [72.5, 84.0, 56.4, 42.2, 50.0, 74.1, 63.2]],
        ['T2I-R1', 6.9, [78.8, 84.7, 57.1, 35.5, 49.7, 77.6, 63.9]],
        ['Uni-CoT', 6.6, [81.2, 84.1, 58.8, 45.8, 53.8, 76.8, 66.8]]
      ]}
    ],
    ours: ['Looped-DiT B/16', 0.26, [87.4, 87.0, 67.0, 53.5, 54.6, 79.7, 71.5]]
  },

  /* Fig. 4: average of the six benchmarks vs. inference cost (TFLOPs per image; s per image on 1x H100, batch 1).
     Averages: Table 1 for the baselines and for Looped-DiT x4/100 steps; the other Looped-DiT settings are the
     plotted values. Cost: printed values where Fig. 1 gives them (Looped-DiT x4/100, InternVL-U), plotted otherwise. */
  pareto: [
    { name: 'Looped-DiT ×1 · 25 steps', loops: 1, steps: 25, tflops: 20.2, latency: 0.094, avg: 67.04, params: 0.26, ours: true },
    { name: 'Looped-DiT ×4 · 25 steps', loops: 4, steps: 25, tflops: 37.5, latency: 0.17, avg: 67.6, params: 0.26, ours: true },
    { name: 'Looped-DiT ×1 · 100 steps', loops: 1, steps: 100, tflops: 80.65, latency: 0.375, avg: 69.25, params: 0.26, ours: true },
    { name: 'Looped-DiT ×2 · 100 steps', loops: 2, steps: 100, tflops: 103.8, latency: 0.47, avg: 70.53, params: 0.26, ours: true },
    { name: 'Looped-DiT ×4 · 100 steps', loops: 4, steps: 100, tflops: 150, latency: 0.65, avg: 71.5, params: 0.26, ours: true },
    { name: 'MiniT2I-B/16', tflops: 80.7, latency: 0.37, avg: 66.4, params: 0.26 },
    { name: 'MiniT2I-L/16', tflops: 264.5, latency: 0.96, avg: 67.3, params: 0.91 },
    { name: 'InternVL-U', tflops: 732, latency: 2.1, avg: 69.0, params: 1.7 },
    { name: 'DeCo-XXL/16', tflops: 72.5, latency: 0.2, avg: 61.9, params: 1.1 },
    { name: 'URSA-0.6B', tflops: 477.6, latency: 1.48, avg: 62.1, params: 0.86 },
    { name: 'CogView4', tflops: 5412, latency: 9.44, avg: 64.0, params: 6.4 }
  ],

  /* Fig. 3: naive looping (B/32, trained at 4 loops, inferred at 1-8) */
  naive: {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    prism: [38.08, 47.7, 50.8, 51.1, 50.0, 49.4, 47.3, 46.0], prismBase: 51.2,
    core: [32.6, 38.7, 39.8, 39.3, 39.0, 38.7, 39.0, 39.0], coreBase: 39.2,
    r2: [0.865, 0.774, 0.691, 0.623, 0.589, 0.571, 0.563, 0.562], r2Base: 0.668
  },

  /* Table 4: component ablations (B/32; DPG, PRISM, CoRe, Spatial; Avg) */
  ablation: [
    { loop: false, ds: null, attn: null, v: [82.0, 51.2, 39.2, 48.3, 55.2] },
    { loop: true, ds: null, attn: null, v: [84.4, 51.1, 39.3, 49.9, 56.2] },
    { loop: true, ds: 'Exponential', attn: null, v: [84.3, 52.1, 41.0, 51.0, 57.1] },
    { loop: true, ds: 'Final + Mean', attn: null, v: [84.4, 53.9, 40.6, 50.9, 57.5] },
    { loop: true, ds: null, attn: 'Gated', v: [84.0, 53.0, 39.5, 49.7, 56.6] },
    { loop: true, ds: null, attn: 'XSA', v: [84.2, 54.5, 43.2, 52.1, 58.5] },
    { loop: true, ds: 'Final + Mean', attn: 'XSA', v: [85.3, 54.4, 44.5, 52.3, 59.1], ours: true }
  ],

  /* Table 2: matched parameters / compute (B/32, avg of 4) */
  matched: [
    { name: 'MiniT2I B/32', sub: 'parameter-matched', train: 441, infer: 146, params: 260, depth: 17, dim: 768, ds: false, loop: false, avg: 55.2 },
    { name: 'Deeper MiniT2I B/32', sub: 'inference-compute-matched', train: 809, infer: 267, params: 473, depth: 32, dim: 768, ds: false, loop: false, avg: 57.7 },
    { name: 'Wider MiniT2I B/32', sub: 'inference-compute-matched', train: 805, infer: 268, params: 489, depth: 17, dim: 1056, ds: false, loop: false, avg: 58.6 },
    { name: 'Deeper MiniT2I B/32 + DeepSup', sub: 'training-compute-matched', train: 1246, infer: 267, params: 473, depth: 32, dim: 768, ds: true, loop: false, avg: 58.1 },
    { name: 'Looped-DiT B/32', sub: 'ours', train: 1246, infer: 267, params: 260, depth: 32, dim: 768, ds: true, loop: true, avg: 59.1, ours: true }
  ],

  /* Fig. 6: loop depth vs. extra denoising steps at matched inference FLOPs (B/32), Euler with time shift s = 3.
     Steps per point: loop x4 at 13/18/25/35/50, loop x1 and non-looped at twice as many.
     Source: results/data/denoise_shift3.csv (2026-10-19). */
  steps: {
    budgets: ['7.5', '10', '14', '20', '28'],
    loop4Steps: [13, 18, 25, 35, 50], loop1Steps: [26, 36, 50, 70, 100],
    DPG: { l4: [85.02, 85.22, 85.47, 85.52, 85.63], l1: [84.39, 84.56, 84.63, 84.65, 84.66], base: [83.48, 83.6, 83.64, 83.82, 83.92] },
    PRISM: { l4: [52.85, 53.0, 53.11, 53.26, 53.31], l1: [51.64, 51.65, 51.83, 51.99, 51.94], base: [50.34, 50.74, 50.81, 51.01, 51.04] },
    CoRe: { l4: [43.37, 43.38, 43.52, 43.86, 43.86], l1: [42.3, 42.37, 42.53, 42.47, 42.59], base: [39.92, 40.14, 40.03, 40.13, 40.33] },
    Spatial: { l4: [51.35, 51.53, 51.74, 51.68, 51.76], l1: [50.88, 50.9, 51.0, 51.07, 51.08], base: [50.1, 50.11, 50.16, 50.23, 50.4] },
    tflops: { l4: [7.11, 9.78, 13.53, 18.87, 26.89], l1: [7.78, 10.71, 14.81, 20.66, 29.45] }
  },

  /* Table 3: gains over the non-looped model with original prompts (B/32) */
  cot: {
    overall: { cot: 2.1, loop: 4.0, both: 5.5 },
    loopFavored: [
      ['PRISM · Long Text', 3.1, 9.1, 9.4],
      ['CoRe · Multi-Relation', 1.2, 8.3, 8.4],
      ['CoRe · Procedural', 4.7, 9.4, 9.6],
      ['Spatial · Orientation', 0.0, 6.0, 6.2],
      ['Spatial · Motion', 0.1, 6.0, 6.3]
    ],
    cotFavored: [
      ['CoRe · Generalization', 22.2, 7.5, 24.5],
      ['CoRe · Hypothetical', 9.4, 3.5, 11.6],
      ['CoRe · Reconstructive', 6.2, 3.4, 8.9]
    ]
  },

  /* Fig. 7: deep supervision, trained at 4 loops, inferred at 1-8 (B/32) */
  deepsup: {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    DPG: { ds: [84.34, 85.08, 85.42, 85.29, 85.12, 85.17, 84.86, 84.79], no: [73.89, 81.89, 83.91, 84.03, 83.64, 83.11, 82.74, 82.24], base: 82.0 },
    PRISM: { ds: [52.0, 54.0, 54.2, 54.4, 54.4, 54.1, 54.3, 53.7], no: [39.1, 48.15, 50.81, 51.28, 50.18, 49.67, 47.75, 46.54], base: 51.2 },
    CoRe: { ds: [43.0, 44.3, 44.4, 44.5, 44.3, 43.9, 43.8, 43.8], no: [33.54, 39.43, 40.49, 40.0, 39.71, 39.43, 39.71, 39.71], base: 39.2 },
    Spatial: { ds: [51.2, 52.2, 52.3, 52.3, 52.1, 52.2, 52.1, 51.9], no: [44.71, 49.42, 49.96, 50.04, 49.07, 49.24, 48.44, 48.09], base: 48.3 }
  },

  /* Fig. 8b: adaptive vs. fixed looping (B/32, avg of 4) */
  adaptive: {
    adaptive: { x: [1.0, 1.25, 1.58, 2.22, 2.70, 3.27, 4.0], y: [57.63, 58.45, 58.84, 58.99, 59.08, 59.10, 59.12] },
    fixed: { x: [1, 2, 3, 4], y: [57.63, 58.89, 59.03, 59.12] }
  },

  /* Fig. 9: position probe R^2 and relative attention update (B/32) */
  sma: {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    r2: {
      'DeepSup + XSA': [0.883, 0.844, 0.811, 0.786, 0.769, 0.757, 0.749, 0.745],
      'DeepSup + Gated': [0.881, 0.824, 0.775, 0.732, 0.698, 0.672, 0.652, 0.639],
      'DeepSup': [0.823, 0.765, 0.722, 0.689, 0.665, 0.647, 0.634, 0.625],
      'Naive looping': [0.865, 0.774, 0.691, 0.623, 0.589, 0.571, 0.563, 0.562]
    },
    r2Base: 0.668,
    upd: {
      'DeepSup + XSA': [0.0563, 0.0505, 0.0454, 0.0408, 0.0370, 0.0338, 0.0313, 0.0292],
      'DeepSup + Gated': [0.0579, 0.0521, 0.0473, 0.0431, 0.0394, 0.0364, 0.0340, 0.0320],
      'DeepSup': [0.0578, 0.0532, 0.0491, 0.0456, 0.0430, 0.0412, 0.0401, 0.0394],
      'Naive looping': [0.0532, 0.0557, 0.0602, 0.0582, 0.0525, 0.0474, 0.0431, 0.0396]
    }
  },

  /* Table 5: XSA with and without looping (B/32, avg of 4) */
  xsa: [
    { group: 'Non-looped, parameter-matched', depth: 17, ds: false, no: 55.2, xsa: 55.1 },
    { group: 'Non-looped, compute-matched', depth: 32, ds: true, no: 58.1, xsa: 58.8 },
    { group: 'Looped', depth: 32, ds: true, no: 57.5, xsa: 59.1, ours: true }
  ],

  /* Not in the paper: the released Looped-DiT B/16 checkpoint (580k EMA) evaluated once (seed 0) at inference loop
     depths 1-4, 100 Euler steps, CFG 6.0. Source: per_image_loops1to4/summary.json and each eval's summary.json.
     Not charted any more; LongText-Bench OCR word accuracy (15.02 → 46.36) is the source of Analysis Q4's 3.1×. */
  textLoops: {
    x: [1, 2, 3, 4],
    series: [
      { name: 'LongText-Bench · OCR word accuracy', cls: 's-ours', y: [15.02, 34.44, 42.82, 46.36] },
      { name: 'T2I-CoReBench · text rendering', cls: 's-ds', y: [27.35, 37.15, 39.79, 42.24] },
      { name: 'PRISM · text rendering', cls: 's-gated', y: [32.10, 45.50, 46.95, 47.00] }
    ],
    byType: [
      ['Web page', 18.04, 63.20], ['Sign', 17.87, 58.37], ['Poster', 19.97, 53.92], ['Slide', 14.69, 47.75],
      ['Dialogue', 18.97, 45.73], ['Print', 13.85, 39.12], ['Caption', 7.63, 38.61], ['Label', 6.68, 19.91]
    ],
    flips: { core: { up: 6451, down: 4049, total: 54116 } }
  }
};
