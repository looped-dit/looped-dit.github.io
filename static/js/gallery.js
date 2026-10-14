/* Looped-DiT project page: images, prompts and media. */
window.LDG = {
 "logos": [
  {
   "name": "SenseTime Research (SenseNova)",
   "src": "static/img/logos/sensenova.png",
   "url": "https://github.com/OpenSenseNova"
  },
  {
   "name": "LeapLab, Tsinghua University",
   "src": "static/img/logos/leaplab.png",
   "url": "https://www.leaplab.ai/"
  },
  {
   "name": "Nanyang Technological University",
   "src": "static/img/logos/ntu.png",
   "url": "https://www.mmlab-ntu.com/"
  }
 ],
 "hero": {
  "prompt": "EMBRACE CHANGE, DREAM BIG AND CREATE A BRIGHTER TOMORROW",
  "promptHtml": "EMBRACE CHANGE, DREAM BIG AND CREATE A BRIGHTER TOMORROW",
  "caption": "From the paper's Fig. 1(c). Loops ×1 to ×3 misspell words; loop ×4 spells every word correctly. InternVL-U (1.7B) also garbles this prompt.",
  "images": [
   {
    "n": 1,
    "src": "static/img/paper/embrace_loop1.webp",
    "ok": false,
    "note": "garbled text"
   },
   {
    "n": 2,
    "src": "static/img/paper/embrace_loop2.webp",
    "ok": false,
    "note": "3 misspelled words"
   },
   {
    "n": 3,
    "src": "static/img/paper/embrace_loop3.webp",
    "ok": false,
    "note": "3 misspelled words"
   },
   {
    "n": 4,
    "src": "static/img/paper/embrace_loop4.webp",
    "ok": true,
    "note": "every word correct"
   }
  ],
  "baseline": {
   "label": "InternVL-U · 1.7B",
   "src": "static/img/paper/embrace_internvlu.webp",
   "ok": false
  }
 },
 "compare": [
  {
   "id": "gym",
   "theme": "Resolving interdependent constraints",
   "prompt": "… Mount an unoccluded mirror on one wall … Set up a weight rack against the wall … Install wall-mounted storage for accessories.",
   "promptHtml": "… Mount an <mark>unoccluded mirror on one wall</mark> … Set up a weight rack <mark>against the wall</mark> … Install <mark>wall-mounted</mark> storage for accessories.",
   "note": "Loop ×1 is a collage with stray text, while loop ×4 places the mirror, rack and storage on the walls.",
   "images": [
    {
     "label": "Loop ×1",
     "src": "static/img/paper/gym_loop1.webp"
    },
    {
     "label": "Loop ×2",
     "src": "static/img/paper/gym_loop2.webp"
    },
    {
     "label": "Loop ×3",
     "src": "static/img/paper/gym_loop3.webp"
    },
    {
     "label": "Loop ×4",
     "src": "static/img/paper/gym_loop4.webp"
    },
    {
     "label": "Non-looped B/16",
     "src": "static/img/paper/gym_nonlooped.webp"
    },
    {
     "label": "InternVL-U",
     "src": "static/img/paper/gym_internvlu.webp"
    },
    {
     "label": "Uni-CoT",
     "src": "static/img/paper/gym_unicot.webp"
    }
   ]
  },
  {
   "id": "stop",
   "theme": "Identifying and correcting inconsistencies",
   "prompt": "… a 'STOP' sign on a pole … a coat that has the word 'HELLO' written on it … a delivery truck has the logo 'EXPRESS' …",
   "promptHtml": "… a '<mark>STOP</mark>' sign on a pole … a coat that has the word '<mark>HELLO</mark>' written on it … a delivery truck has the logo '<mark>EXPRESS</mark>' …",
   "note": "The truck’s “EXPPRESS” becomes “EXPRESS” by loop ×4.",
   "images": [
    {
     "label": "Loop ×1",
     "src": "static/img/paper/stop_loop1.webp"
    },
    {
     "label": "Loop ×2",
     "src": "static/img/paper/stop_loop2.webp"
    },
    {
     "label": "Loop ×3",
     "src": "static/img/paper/stop_loop3.webp"
    },
    {
     "label": "Loop ×4",
     "src": "static/img/paper/stop_loop4.webp"
    },
    {
     "label": "Non-looped B/16",
     "src": "static/img/paper/stop_nonlooped.webp"
    },
    {
     "label": "InternVL-U",
     "src": "static/img/paper/stop_internvlu.webp"
    },
    {
     "label": "Uni-CoT",
     "src": "static/img/paper/stop_unicot.webp"
    }
   ]
  },
  {
   "id": "tea",
   "theme": "Identifying and correcting inconsistencies",
   "prompt": "… Five ceramic tea bowls in different colors - emerald green, deep indigo, pure white, charcoal black, and sunset orange …",
   "promptHtml": "… <mark>Five</mark> ceramic tea bowls in different colors - emerald green, deep indigo, pure white, charcoal black, and sunset orange …",
   "note": "Loop ×1 draws 4 bowls and loop ×2 draws 6, while loops ×3 and ×4 draw the requested 5.",
   "images": [
    {
     "label": "Loop ×1",
     "src": "static/img/paper/tea_loop1.webp"
    },
    {
     "label": "Loop ×2",
     "src": "static/img/paper/tea_loop2.webp"
    },
    {
     "label": "Loop ×3",
     "src": "static/img/paper/tea_loop3.webp"
    },
    {
     "label": "Loop ×4",
     "src": "static/img/paper/tea_loop4.webp"
    },
    {
     "label": "Non-looped B/16",
     "src": "static/img/paper/tea_nonlooped.webp"
    },
    {
     "label": "InternVL-U",
     "src": "static/img/paper/tea_internvlu.webp"
    },
    {
     "label": "Uni-CoT",
     "src": "static/img/paper/tea_unicot.webp"
    }
   ]
  }
 ],
 "adaptive": [
  {
   "id": "feathers",
   "prompt": "Exactly three large, colorful feathers are attached to the top …",
   "promptHtml": "<b>Exactly three</b> large, colorful feathers are attached to the top …",
   "images": [
    {
     "label": "L = 1",
     "src": "static/img/paper/feathers_L1.webp",
     "ok": false
    },
    {
     "label": "L = 2",
     "src": "static/img/paper/feathers_L2.webp",
     "ok": false
    },
    {
     "label": "L = 3",
     "src": "static/img/paper/feathers_L3.webp",
     "ok": true
    },
    {
     "label": "L = 4",
     "src": "static/img/paper/feathers_L4.webp",
     "ok": true
    },
    {
     "label": "L̄ = 2.84",
     "src": "static/img/paper/feathers_adaptive.webp",
     "ok": true,
     "adaptive": true
    }
   ]
  },
  {
   "id": "whale",
   "prompt": "A colossal whale hollowed out to cradle a warmly lit library.",
   "images": [
    {
     "label": "L = 1",
     "src": "static/img/paper/whale_L1.webp",
     "ok": false
    },
    {
     "label": "L = 2",
     "src": "static/img/paper/whale_L2.webp",
     "ok": true
    },
    {
     "label": "L = 3",
     "src": "static/img/paper/whale_L3.webp",
     "ok": true
    },
    {
     "label": "L = 4",
     "src": "static/img/paper/whale_L4.webp",
     "ok": true
    },
    {
     "label": "L̄ = 1.03",
     "src": "static/img/paper/whale_adaptive.webp",
     "ok": true,
     "adaptive": true
    }
   ]
  }
 ],
 "xsaCase": {
  "prompt": "a playful image of 2 toy elephants and 4 white balloons",
  "promptHtml": "Prompt: “a playful image of 2 toy elephants and <b>4 white balloons</b>”",
  "rows": [
   {
    "name": "No XSA",
    "heat": "static/img/paper/xsa_noxsa_strip.webp",
    "ok": false,
    "counts": [
     4,
     5,
     5,
     5
    ]
   },
   {
    "name": "XSA",
    "heat": "static/img/paper/xsa_xsa_strip.webp",
    "ok": true,
    "counts": [
     4,
     4,
     4,
     4
    ]
   }
  ],
 },
 "gallery": {
  "finalsTitle": "More samples",
  "items": [
   {
    "id": "geneval-00542-0",
    "bench": "GenEval",
    "filter": "GenEval",
    "cat": "Attribute binding",
    "judge": "GenEval detector",
    "prompt": "a photo of a brown giraffe and a white stop sign",
    "note": "The stop sign stays red, the usual color, at loops ×1 and ×2, and turns white as the prompt asks from ×3.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/geneval-00542-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/geneval-00542-0_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/geneval-00542-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/geneval-00542-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "longtext-poster-125-1",
    "bench": "LongText-Bench",
    "filter": "Text rendering",
    "cat": "Poster",
    "judge": "OCR: required words found",
    "prompt": "A poster designed in vivid retro style announcing a summer outdoor cinema event. Textual elements and their spatial layout within the image are as follows: At the top center, the inviting phrase \"Cinema Under The Stars, Experience Movies Like Never Before\" is displayed in stylish retro typography. Below this, a minimalist vintage film projector illustration projects stylized beams downward. In a bold, central position lower down, the event title \"Moonlit Movies\" appears prominently in expressive lettering. Neatly aligned at the bottom of the poster are concise event details: date \"July 10–15\" and venue name \"Sunset Park\". Soft retro shades and illustrative motifs surround and unify the textual content.",
    "note": "“Ciinem the the Stars … Juy-110-15” at loop ×1 becomes “Cinema Under the Stars … Moonlit Movies … SUNSET PARK” at ×4, with “Jully” still misspelled.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/longtext-poster-125-1_0.webp",
      "ok": null,
      "score": "3/15"
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/longtext-poster-125-1_1.webp",
      "ok": null,
      "score": "7/15"
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/longtext-poster-125-1_2.webp",
      "ok": null,
      "score": "12/15"
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/longtext-poster-125-1_3.webp",
      "ok": true,
      "score": "15/15"
     }
    ]
   },
   {
    "id": "corebench-r-pr-018-1",
    "bench": "T2I-CoReBench",
    "filter": "T2I-CoReBench",
    "cat": "Procedural reasoning",
    "judge": "Qwen3-VL checklist",
    "prompt": "Beachside art scene: You are creating a detailed sand sculpture using layering and carving techniques. Follow these steps in order: 1. Choose a location on the beach with firm, damp sand near the water's edge. 2. Build a large rectangular base of packed sand approximately 3 feet wide. 3. Add successive layers of sand, packing each one firmly before adding the next. 4. Shape the overall form into a castle structure with walls and towers. 5. Carve detailed windows and doors into the castle walls using sculpting tools. 6. Create a surrounding moat by digging channels around the castle base. 7. Wait for incoming waves to reach the moat channels. 8. Decorate the castle with shells, seaweed, and small stones found on the beach. 9. Build small flags from driftwood pieces and seaweed, placing them on the towers. Show the completed sand castle with moat and natural decorations.",
    "note": "Loop ×1 floats garbled text labels over the beach, and later loops drop them and finish the moat and shell decoration.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/corebench-r-pr-018-1_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/corebench-r-pr-018-1_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/corebench-r-pr-018-1_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/corebench-r-pr-018-1_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "spatial-000136-0",
    "bench": "SpatialGenEval",
    "filter": "SpatialGenEval",
    "cat": "Beach",
    "judge": "Qwen2.5-VL, 10 questions",
    "prompt": "A man is doing a handstand in the center of the frame, his body perfectly straight with feet pointing towards the sky. His reflection is faintly visible in the wet sand beneath him. A dog is sitting on the right, watching him intently, its head tilted. The man's shadow is cast directly underneath him by the midday sun.",
    "note": "The dog sitting to the right and watching the handstand is missing at loop ×1 and present from ×2.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/spatial-000136-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/spatial-000136-0_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/spatial-000136-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/spatial-000136-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "prism-text-rendering-012-0",
    "bench": "PRISM",
    "filter": "Text rendering",
    "cat": "Text rendering",
    "judge": "Qwen2.5-VL alignment, 0–10",
    "prompt": "A young climate activist stands at a podium marked \"COP24\" and \"2018,\" addressing an audience with flags of the United Nations and Poland in the background.",
    "note": "The podium reads “CP24” for three loop depths, and loop ×4 renders “COP24 / 2018”.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/prism-text-rendering-012-0_0.webp",
      "ok": null,
      "score": "1/2"
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/prism-text-rendering-012-0_1.webp",
      "ok": null,
      "score": "1/2"
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/prism-text-rendering-012-0_2.webp",
      "ok": null,
      "score": "1/2"
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/prism-text-rendering-012-0_3.webp",
      "ok": true,
      "score": "2/2"
     }
    ]
   },
   {
    "id": "geneval-00235-2",
    "bench": "GenEval",
    "filter": "GenEval",
    "cat": "Counting",
    "judge": "GenEval detector",
    "prompt": "a photo of four traffic lights",
    "note": "Two traffic lights at loop ×1, the requested four from ×2.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/geneval-00235-2_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/geneval-00235-2_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/geneval-00235-2_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/geneval-00235-2_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "geneval-00182-0",
    "bench": "GenEval",
    "filter": "GenEval",
    "cat": "Counting",
    "judge": "GenEval detector",
    "prompt": "a photo of two frisbees",
    "note": "Three frisbees at loop ×1, the requested two from ×2.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/geneval-00182-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/geneval-00182-0_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/geneval-00182-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/geneval-00182-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "prism-text-rendering-084-0",
    "bench": "PRISM",
    "filter": "Text rendering",
    "cat": "Text rendering",
    "judge": "Qwen2.5-VL alignment, 0–10",
    "prompt": "A cheerful woman stands in front of a cozy yellow house, holding signs that read \"BUY\" and \"RENT.\"",
    "note": "The second sign reads “REN” at loops ×1 to ×3, and loop ×4 completes “RENT”.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/prism-text-rendering-084-0_0.webp",
      "ok": null,
      "score": "1/2"
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/prism-text-rendering-084-0_1.webp",
      "ok": null,
      "score": "1/2"
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/prism-text-rendering-084-0_2.webp",
      "ok": null,
      "score": "1/2"
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/prism-text-rendering-084-0_3.webp",
      "ok": true,
      "score": "2/2"
     }
    ]
   },
   {
    "id": "spatial-000218-0",
    "bench": "SpatialGenEval",
    "filter": "SpatialGenEval",
    "cat": "Underwater",
    "judge": "Qwen2.5-VL, 10 questions",
    "prompt": "A rusted naval mine from a past war is anchored in the center, floating ominously. A small, exploratory submarine is at the bottom-left, facing it. The mine is twice the diameter of the submarine's main viewport. A thick stalk of kelp growing from the seabed partially occludes the mine's chain. The submarine's reverse thrusters push a cloud of silt towards the mine.",
    "note": "At loop ×1 the submarine is a small blur at the far left, but by ×3 it is a clear small submarine at the bottom left, facing the mine.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/spatial-000218-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/spatial-000218-0_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/spatial-000218-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/spatial-000218-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "corebench-r-ar-046-1",
    "bench": "T2I-CoReBench",
    "filter": "T2I-CoReBench",
    "cat": "Analogical reasoning",
    "judge": "Qwen3-VL checklist",
    "prompt": "Just as a geode displays the following visual properties: (1) it has a hollow cavity on the inside, (2) the interior surface is completely lined with inward-pointing crystals, (3) there is a sharp boundary between the outer shell and the inner crystal layer, (4) the crystals are sharp and multifaceted, and (5) the crystal size is largest at the back and smaller near the opening. Now, apply this rule to a different target scene: The 'geode' is a magical fruit, called a 'Starmelon', which is shown cut in half. The 'outer shell' is a smooth, green rind. The 'crystals' are a form of crystallized, edible, glowing blue sugar. The image should ultimately be guided by the visual analogy, prioritizing its rules over real-world physics.",
    "note": "Loop ×1 surrounds the geode-melon with garbled caption text, but from ×3 the image is clean and every checklist question passes.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/corebench-r-ar-046-1_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/corebench-r-ar-046-1_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/corebench-r-ar-046-1_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/corebench-r-ar-046-1_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "geneval-00485-0",
    "bench": "GenEval",
    "filter": "GenEval",
    "cat": "Attribute binding",
    "judge": "GenEval detector",
    "prompt": "a photo of a pink tv remote and a blue airplane",
    "note": "Colors leak between the remote and airplane at loop ×1–×2, but from ×3 both are correct.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/geneval-00485-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/geneval-00485-0_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/geneval-00485-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/geneval-00485-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "spatial-000451-0",
    "bench": "SpatialGenEval",
    "filter": "SpatialGenEval",
    "cat": "Sports",
    "judge": "Qwen2.5-VL, 10 questions",
    "prompt": "A tall basketball player in a red '23' jersey jumps at the court's center to dunk a textured orange basketball. To his left, a shorter defender in a blue '10' jersey faces him, attempting to block. Arranged closely near the hoop, the jumping player's body partially occludes the defender. The basketball is nearest to the tall player's hand. An explosive jump causes sweat to fly from his brow.",
    "note": "The defender's jersey shows 11 at loop ×1 and the requested 10 from ×2.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/spatial-000451-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/spatial-000451-0_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/spatial-000451-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/spatial-000451-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "dpg-partiprompts19-2",
    "bench": "DPG-Bench",
    "filter": "DPG-Bench",
    "cat": "Dense prompt",
    "judge": "mPLUG questions",
    "prompt": "Inside a temple, a unique wall painting captures the whimsical image of pandas engaged in a game of tennis, rendered in a style reminiscent of ancient Egyptian hieroglyphics. The pandas are depicted with exaggerated, playful expressions, using rackets that are stylistically simplified. The wall on which the painting is displayed has a textured, sandy hue, providing a stark contrast to the dark, bold lines of the painted figures.",
    "note": "Loop ×1 draws a plain two-panda cartoon, and from ×3 the wall painting gains a hieroglyph band and a third panda.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/dpg-partiprompts19-2_0.webp",
      "ok": null,
      "score": "0%"
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/dpg-partiprompts19-2_1.webp",
      "ok": null,
      "score": "93%"
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/dpg-partiprompts19-2_2.webp",
      "ok": true,
      "score": "100%"
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/dpg-partiprompts19-2_3.webp",
      "ok": true,
      "score": "100%"
     }
    ]
   },
   {
    "id": "geneval-00199-3",
    "bench": "GenEval",
    "filter": "GenEval",
    "cat": "Counting",
    "judge": "GenEval detector",
    "prompt": "a photo of three oranges",
    "note": "Four oranges at loop ×1, the requested three from ×2.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/geneval-00199-3_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/geneval-00199-3_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/geneval-00199-3_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/geneval-00199-3_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "prism-text-rendering-040-0",
    "bench": "PRISM",
    "filter": "Text rendering",
    "cat": "Text rendering",
    "judge": "Qwen2.5-VL alignment, 0–10",
    "prompt": "A black headlight switch features a button with directional arrows and the label \"LIGHTS OFF\" indicating its function.",
    "note": "The switch label reads “LGHTS LOF OFF” at loop ×1 and “LIGHTS OFF”, with direction arrows, at ×4.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/prism-text-rendering-040-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/prism-text-rendering-040-0_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/prism-text-rendering-040-0_2.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/prism-text-rendering-040-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "spatial-000121-0",
    "bench": "SpatialGenEval",
    "filter": "SpatialGenEval",
    "cat": "Beach",
    "judge": "Qwen2.5-VL, 10 questions",
    "prompt": "On the bottom-left, a collection of four smooth, grey stones are stacked into a small tower. This stone tower is half the height of a nearby sandcastle on the right. A child's hand reaches in from the left, placing another stone on top. A large, leafy palm frond hangs into the top of the frame, partially obscuring the bright sun.",
    "note": "The sandcastle beside the stone tower is missing at loop ×1 and appears from ×2.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/spatial-000121-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/spatial-000121-0_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/spatial-000121-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/spatial-000121-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "longtext-poster-124-1",
    "bench": "LongText-Bench",
    "filter": "Text rendering",
    "cat": "Poster",
    "judge": "OCR: required words found",
    "prompt": "An artistic poster designed in a colorful, contemporary minimalist style for a modern poetry reading event. Textual elements and their spatial layout within the image are as follows: At the top center, the poetic phrase \"Words Awaken Emotions on a Night of Poetic Expression\" is presented in clear, sophisticated typography. Immediately underneath, a simple, abstract illustration resembling an open book or folded pages artfully complements the text. Centered towards the lower portion, the main event title \"Evening of Verse\" appears prominently in bold, modern script. At the bottom center, neatly aligned in subtle, minimalist font is the event date \"April 21\" and venue \"Luna Cafe\". Delicate geometric accents subtly frame the text, enhancing the inviting visual harmony.",
    "note": "“Eveniing Eserin of Vese” at loop ×1 becomes “Evening of Verse … April 21 … Luna Cafe” at ×4.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/longtext-poster-124-1_0.webp",
      "ok": null,
      "score": "3/16"
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/longtext-poster-124-1_1.webp",
      "ok": null,
      "score": "7/16"
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/longtext-poster-124-1_2.webp",
      "ok": null,
      "score": "11/16"
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/longtext-poster-124-1_3.webp",
      "ok": null,
      "score": "15/16"
     }
    ]
   },
   {
    "id": "geneval-00491-0",
    "bench": "GenEval",
    "filter": "GenEval",
    "cat": "Attribute binding",
    "judge": "GenEval detector",
    "prompt": "a photo of a white pizza and a green umbrella",
    "note": "The pizza carries tomato and basil at loop ×1, but from ×3 it is the plain white pizza the prompt asks for.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/geneval-00491-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/geneval-00491-0_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/geneval-00491-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/geneval-00491-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "prism-text-rendering-006-0",
    "bench": "PRISM",
    "filter": "Text rendering",
    "cat": "Text rendering",
    "judge": "Qwen2.5-VL alignment, 0–10",
    "prompt": "A cozy bedroom features a neatly arranged bed with colorful pillows and blankets, accompanied by a vase of greenery on a side table, while the wall above displays the humorous quote \"WHY FALL IN LOVE, WHEN YOU CAN... FALL ASLEEP?\" in bold black letters.",
    "note": "Loop ×1 writes “WHY FALLL LOVE, WEHN YOU CAN… FEALL. ASLEEEP?”. Loop ×2 fixes everything except “ASLEEEP”, and loops ×3 and ×4 spell the whole line correctly.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/prism-text-rendering-006-0_0.webp",
      "ok": null,
      "score": "4/9"
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/prism-text-rendering-006-0_1.webp",
      "ok": null,
      "score": "8/9"
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/prism-text-rendering-006-0_2.webp",
      "ok": true,
      "score": "9/9"
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/prism-text-rendering-006-0_3.webp",
      "ok": true,
      "score": "9/9"
     }
    ]
   },
   {
    "id": "corebench-r-pr-061-2",
    "bench": "T2I-CoReBench",
    "filter": "T2I-CoReBench",
    "cat": "Procedural reasoning",
    "judge": "Qwen3-VL checklist",
    "prompt": "Illustrate the final scene after performing all of the following seven steps in order:\n1. Set an empty clear parfait glass on the centre of a wooden kitchen counter.\n2. Spoon a layer of plain white yogurt into the bottom of the glass.\n3. Sprinkle a layer of golden granola evenly over the yogurt.\n4. Add a layer of sliced fresh strawberries on top of the granola.\n5. Repeat with a second thinner layer of yogurt so that the strawberry slices remain visible from the side.\n6. Drizzle honey in a thin spiral over the upper yogurt layer.\n7. Place a single fresh mint sprig upright in the centre of the top layer and set a long-handled dessert spoon to the right of the glass.\nRender the kitchen counter exactly as it appears once all seven steps are complete.",
    "note": "From loop ×3 the parfait's layers follow the seven steps in order.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/corebench-r-pr-061-2_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/corebench-r-pr-061-2_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/corebench-r-pr-061-2_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/corebench-r-pr-061-2_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "geneval-00423-0",
    "bench": "GenEval",
    "filter": "GenEval",
    "cat": "Position",
    "judge": "GenEval detector",
    "prompt": "a photo of a cup left of an umbrella",
    "note": "At loops ×1 and ×2 an open umbrella sits behind the cup, but from ×3 the cup stands clearly to the left of a closed umbrella.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/geneval-00423-0_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/geneval-00423-0_1.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/geneval-00423-0_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/geneval-00423-0_3.webp",
      "ok": true,
      "score": null
     }
    ]
   },
   {
    "id": "corebench-c-ma-090-1",
    "bench": "T2I-CoReBench",
    "filter": "T2I-CoReBench",
    "cat": "Multi-attribute",
    "judge": "Qwen3-VL checklist",
    "prompt": "Depict a single Baltic-amber pendant hanging from a fine rose-gold chain against a slate-grey linen backdrop. The pendant is an oval cabochon of honey-gold amber with tiny, clearly visible fern inclusions. A filigree rose-gold bezel surrounds the stone, set with four seed pearls at cardinal points. The bail features an engraved infinity symbol. The chain links are rope-style and highly polished. The amber surface is unblemished, the pearls show no discoloration, and the piece contains no silver components.",
    "note": "The fern inclusion in the amber is faint at loop ×1 and clear from ×2, and an infinity symbol appears on the bail at ×3.",
    "images": [
     {
      "label": "Loop ×1",
      "src": "static/img/gallery/corebench-c-ma-090-1_0.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×2",
      "src": "static/img/gallery/corebench-c-ma-090-1_1.webp",
      "ok": false,
      "score": null
     },
     {
      "label": "Loop ×3",
      "src": "static/img/gallery/corebench-c-ma-090-1_2.webp",
      "ok": true,
      "score": null
     },
     {
      "label": "Loop ×4",
      "src": "static/img/gallery/corebench-c-ma-090-1_3.webp",
      "ok": true,
      "score": null
     }
    ]
   }
  ],
  "finals": [
   {
    "id": "prism-imagination-093",
    "src": "static/img/finals/prism-imagination-093.webp",
    "prompt": "A surreal feline figure stands serenely, its back transformed into a lush, miniature ecosystem where birds soar gracefully among sprouting trees, while its belly glows with swirling cosmic patterns, defying the boundaries between nature and the universe.",
    "bench": "PRISM"
   },
   {
    "id": "prism-imagination-055",
    "src": "static/img/finals/prism-imagination-055.webp",
    "prompt": "A whimsical tabby cat, suspended against the vast expanse of the cosmos, yawns wide, revealing a galaxy spiraling within its open mouth, as if the universe itself is caught in its playful embrace.",
    "bench": "PRISM"
   },
   {
    "id": "prism-affection-032",
    "src": "static/img/finals/prism-affection-032.webp",
    "prompt": "Where steampunk gears meet the beating heart, this necklace whispers a symphony of mechanical romance, blending the precision of industry with the warmth of emotion, evoking a timeless dance between innovation and love.",
    "bench": "PRISM"
   },
   {
    "id": "prism-composition-089",
    "src": "static/img/finals/prism-composition-089.webp",
    "prompt": "Circular embroidery hoop featuring a hand-stitched design with pastel floral wreath and the word \"Hope\" in the center, suspended as a festive ornament against a backdrop of green pine branches and warm holiday lights.",
    "bench": "PRISM"
   },
   {
    "id": "prism-affection-077",
    "src": "static/img/finals/prism-affection-077.webp",
    "prompt": "Under the ethereal glow of the aurora borealis, a solitary figure stands before an illuminated ice igloo, embodying a profound sense of wonder and introspection amidst the serene, otherworldly beauty of the Arctic night.",
    "bench": "PRISM"
   },
   {
    "id": "dpg-partiprompts268",
    "src": "static/img/finals/dpg-partiprompts268.webp",
    "prompt": "a striking propaganda poster featuring a cat with a sly expression, dressed in an elaborate costume reminiscent of French Emperor Napoleon Bonaparte. The feline figure is holding a large, yellow wedge of cheese as if it were a precious treasure. The background of the poster is a bold red, with ornate golden details that give it an air of regal authority.",
    "bench": "DPG-Bench"
   },
   {
    "id": "prism-style-090",
    "src": "static/img/finals/prism-style-090.webp",
    "prompt": "Stunning macro photograph of a spider web adorned with minuscule, spherical water droplets, each reflecting a miniature version of the world. The web's delicate silk threads are in sharp focus. The background is a dark, out-of-focus garden, creating a beautiful bokeh effect. Backlit by the morning sun.",
    "bench": "PRISM"
   },
   {
    "id": "prism-imagination-023",
    "src": "static/img/finals/prism-imagination-023.webp",
    "prompt": "Sentient raindrops, adorned with whimsical accessories, perch joyfully on a brick wall, defying gravity and convention in a world where water takes on life and character.",
    "bench": "PRISM"
   },
   {
    "id": "prism-composition-024",
    "src": "static/img/finals/prism-composition-024.webp",
    "prompt": "Elegant three-tiered wedding cake featuring black, white, and purple accents, adorned with purple glitter skulls atop and vibrant purple roses interspersed with intricate black silhouettes of castle-like structures on each tier, set against a backdrop of cascading purple floral arrangements.",
    "bench": "PRISM"
   },
   {
    "id": "dpg-midjourney24",
    "src": "static/img/finals/dpg-midjourney24.webp",
    "prompt": "A meticulously crafted Art Nouveau screenprint featuring a dog's face, characterized by its remarkable symmetry and elaborate detailing. The canine visage, which is the central motif of the piece, exhibits intricate linework and stylized features typical of the Art Nouveau aesthetic. The artwork is deftly rendered in a harmonious palette, with each element of the design echoing the balanced and ornate nature of the style.",
    "bench": "DPG-Bench"
   },
   {
    "id": "spatialgeneval-000050",
    "src": "static/img/finals/spatialgeneval-000050.webp",
    "prompt": "In a clearing within a bamboo forest stands a small wooden tea house in the center. To its right is a stone lantern, which is shorter than the tea house. A red paper umbrella leans against the left side of the house. Inside, a tea master, partially obscured by the entrance frame, faces the open front while pouring tea from a teapot into one of three white ceramic cups arranged in a line. Rain falls, causing droplets to run down the umbrella.",
    "bench": "SpatialGenEval"
   },
   {
    "id": "prism-style-085",
    "src": "static/img/finals/prism-style-085.webp",
    "prompt": "A minimalist black and white long-exposure photograph of a serene seascape. A solitary wooden pier extends into the calm ocean, the water smoothed into a milky, dreamlike surface, and the sky is filled with soft, streaky clouds.",
    "bench": "PRISM"
   }
  ]
 },
 "marquee": [
  {
   "id": "longtext-sign-5-2",
   "a": "static/img/gallery/longtext-sign-5-2_0.webp",
   "b": "static/img/gallery/longtext-sign-5-2_3.webp",
   "src": "LongText-Bench",
   "prompt": "A cozy and inviting cafe situated on a bustling city street corner, featuring a charming storefront with a captivating sign suspended gracefully above the entrance. Crafted from rustic wood, the sign immediately draws attention with its beautifully painted, elegant cursive lettering that warmly announces, \"BREWED WITH LOVE, SERVED WITH CARE\". Clearly visible just below this main phrase in slightly smaller yet distinct lettering are the informative words, \"Open Daily: 7 AM - 9 PM\", guiding cafe visitors. Around the eye-catching sign, lush potted plants and delicate fairy lights create an intimate, welcoming ambiance, perfectly matching the cafe's quaint and relaxing character. Nearby, contented customers relax comfortably at outdoor tables, leisurely sipping fresh coffee and savoring delicious pastries, as the delightful scent of freshly brewed coffee fills the air, enhancing the inviting appeal of this lively urban cafe setting."
  },
  {
   "id": "geneval-00542-0",
   "a": "static/img/gallery/geneval-00542-0_0.webp",
   "b": "static/img/gallery/geneval-00542-0_3.webp",
   "src": "GenEval",
   "prompt": "a photo of a brown giraffe and a white stop sign"
  },
  {
   "id": "prism-text-rendering-012-0",
   "a": "static/img/gallery/prism-text-rendering-012-0_0.webp",
   "b": "static/img/gallery/prism-text-rendering-012-0_3.webp",
   "src": "PRISM",
   "prompt": "A young climate activist stands at a podium marked \"COP24\" and \"2018,\" addressing an audience with flags of the United Nations and Poland in the background."
  },
  {
   "id": "longtext-poster-120-1",
   "a": "static/img/gallery/longtext-poster-120-1_0.webp",
   "b": "static/img/gallery/longtext-poster-120-1_3.webp",
   "src": "LongText-Bench",
   "prompt": "A visually striking poster designed in a vintage Art Deco style for a summer jazz music festival. The textual elements and their spatial layout within the image are as follows: At the very top, the phrase \"Feel the Rhythm, Ignite your Soul at Jazz Nights\" prominently appears in bold, sleek typography spanning horizontally across the poster. Directly below, stylized trumpet and saxophone silhouettes artfully frame the event title. Centered and slightly lower, the event name \"Jazz Under the Stars\" appears prominently in elegant lettering. Near the bottom-center, smaller text neatly aligned lists \"August 12–14, Waterfront Amphitheater\", clearly presenting event date and location. At the very bottom are minimalistic scrolling decorative lines, enhancing the vintage elegance and symmetry of the overall layout."
  },
  {
   "id": "geneval-00235-2",
   "a": "static/img/gallery/geneval-00235-2_0.webp",
   "b": "static/img/gallery/geneval-00235-2_3.webp",
   "src": "GenEval",
   "prompt": "a photo of four traffic lights"
  },
  {
   "id": "prism-text-rendering-084-0",
   "a": "static/img/gallery/prism-text-rendering-084-0_0.webp",
   "b": "static/img/gallery/prism-text-rendering-084-0_3.webp",
   "src": "PRISM",
   "prompt": "A cheerful woman stands in front of a cozy yellow house, holding signs that read \"BUY\" and \"RENT.\""
  },
  {
   "id": "corebench-c-tr-032-1",
   "a": "static/img/gallery/corebench-c-tr-032-1_0.webp",
   "b": "static/img/gallery/corebench-c-tr-032-1_3.webp",
   "src": "T2I-CoReBench",
   "prompt": "Generate a photorealistic image of a sleek, futuristic soda can made of dark chrome. The text on the can should appear distorted by the can's cylindrical shape. The main brand name wrapping around the top is 'GALAXY-POP™' in a bold, silver, sans-serif font. Below this, the flavor is 'Quantum Fizz'. On the front of the can, there is a section titled 'NUTRITIONAL INFO (per 330ml)'. This section contains: 'Energy: 0 kJ / 0 kcal', 'Astro-Carbs: 0.1g', 'Dark Matter: 99.9%', and 'Sugar: <0.1g'. Below this, in small print, is the text 'Artificially Flavored & Carbonated'. On the right side of the can, there is a stylized line-art drawing of an atom. Critically, there are **no other drawings, logos, or icons anywhere else** on the can."
  },
  {
   "id": "spatial-000136-0",
   "a": "static/img/gallery/spatial-000136-0_0.webp",
   "b": "static/img/gallery/spatial-000136-0_3.webp",
   "src": "SpatialGenEval",
   "prompt": "A man is doing a handstand in the center of the frame, his body perfectly straight with feet pointing towards the sky. His reflection is faintly visible in the wet sand beneath him. A dog is sitting on the right, watching him intently, its head tilted. The man's shadow is cast directly underneath him by the midday sun."
  },
  {
   "id": "longtext-print-41-0",
   "a": "static/img/gallery/longtext-print-41-0_0.webp",
   "b": "static/img/gallery/longtext-print-41-0_3.webp",
   "src": "LongText-Bench",
   "prompt": "A bright, welcoming bakery interior, captured in warm, soft morning light, showcasing an appealing, rustic wooden-framed chalkboard menu placed prominently against a white brick wall. At the center of the chalkboard, in large, elegant hand-drawn lettering, reads clearly \"Today's Specials: Sourdough Bread & Cinnamon Rolls\". Just below this central message, smaller text neatly notes \"Freshly baked every morning\". At the top right corner of the chalkboard, subtly written in a playful cursive handwriting, are the words \"Homemade with Passion\". Around the borders of the menu, slightly faded and vintage-inspired illustrations of wheat stalks and pastries subtly frame the text, enhancing the artisanal bakery atmosphere. Beside the main chalkboard stands a smaller wooden sign, on which handwritten text reads \"Free samples available!\", accompanied by a decorative arrow directing customers toward the display counter. The textual elements are distinct, stylish, and naturally handwritten, evoking a genuine, artisanal feel, perfectly complementing the inviting bakery ambiance."
  },
  {
   "id": "dpg-partiprompts19-2",
   "a": "static/img/gallery/dpg-partiprompts19-2_0.webp",
   "b": "static/img/gallery/dpg-partiprompts19-2_3.webp",
   "src": "DPG-Bench",
   "prompt": "Inside a temple, a unique wall painting captures the whimsical image of pandas engaged in a game of tennis, rendered in a style reminiscent of ancient Egyptian hieroglyphics. The pandas are depicted with exaggerated, playful expressions, using rackets that are stylistically simplified. The wall on which the painting is displayed has a textured, sandy hue, providing a stark contrast to the dark, bold lines of the painted figures."
  },
  {
   "id": "geneval-00182-0",
   "a": "static/img/gallery/geneval-00182-0_0.webp",
   "b": "static/img/gallery/geneval-00182-0_3.webp",
   "src": "GenEval",
   "prompt": "a photo of two frisbees"
  },
  {
   "id": "longtext-dialogue-182-0",
   "a": "static/img/gallery/longtext-dialogue-182-0_0.webp",
   "b": "static/img/gallery/longtext-dialogue-182-0_3.webp",
   "src": "LongText-Bench",
   "prompt": "A playful cartoon-style illustration showing two robots humorously conversing inside a futuristic, tech-themed workshop filled with mechanical parts and gadgets. At the upper-left side of the panel, Robot A, holding up a rusty, detached metal arm, looks concerned and asks in an oval-shaped speech bubble with bold, playful lettering, \"Have you seen my left arm anywhere?\". On the lower-right side, Robot B responds casually, pointing toward a cluttered shelf behind him, with a rectangular speech bubble and italicized friendly font replying, \"Check behind your spare battery, happens all the time!\". Robot B's speech bubble partially overlaps slightly beneath Robot A's bubble, guiding the reading flow naturally diagonally downward. Each bubble contains fewer than 10 words, clearly delivering a humorous exchange between the robot characters."
  }
 ]
};
