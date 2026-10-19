/*
  Plant Doc answers (DRAFT)
  =========================
  DRAFT, NOT YET REVIEWED BY A HORTICULTURIST. There is no AI and no expert
  behind Plant Doc: the answers come from the fixed list below. They are kept
  general and cautious on purpose, and the page sends anything serious to a
  local extension office or horticulturist.

  SKELETON: a short list to show the format. To add to it:

  PARTS      what the visitor says looks wrong, and the symptoms to choose
             from for each part.
  CAUSES     the possible causes, each with what it means and what to do.
  MATCHES    for each symptom, the causes to show, most likely first. A cause
             listed under "palm" is shown first when the plant is a palm.
*/

const DOC_KINDS = ["Palm", "Tree", "Shrub", "Groundcover or grass", "Something else"];

const DOC_PARTS = {
  "Leaves": ["Turning yellow", "Brown tips or edges", "Spots", "Holes or chewed edges", "Sticky, or a black coating", "White fluffy bits"],
  "Trunk or stem": ["Soft or rotting near the ground", "Holes or oozing sap"],
  "The whole plant": ["Wilting", "Dropping leaves", "Damaged after a cold night"],
};

const DOC_CAUSES = {
  overwatering: {
    name: "Too much water, or soil that stays wet",
    means: "Roots need air as well as water. In soil that stays wet they start to rot, and the plant shows it in the leaves first.",
    todo: ["Let the top few inches of soil dry before watering again.", "Check that the pot or the planting hole drains.", "If the base of the stem is soft, the roots may already be rotting: ask a grower or the extension office."],
  },
  underwatering: {
    name: "Not enough water",
    means: "New plantings and container plants dry out fast in Florida sun, even when the ground looks damp on top.",
    todo: ["Water deeply, then check the soil a few inches down before watering again.", "Water new plantings more often for the first weeks while roots grow out."],
  },
  nutrients: {
    name: "Missing nutrients",
    means: "Palms in particular yellow when they lack potassium or magnesium. The oldest fronds show it first.",
    todo: ["Use a fertilizer made for palms or for the kind of plant you have, as the label says.", "Do not cut off yellowing palm fronds early: the palm is still drawing on them."],
  },
  scale: {
    name: "Scale or other sap-sucking insects",
    means: "Small bumps or specks feed on sap and leave a sticky residue. Black sooty mold grows on that residue.",
    todo: ["Look at the undersides of leaves and along the stems.", "Wipe or prune off light infestations.", "Ask a garden center or the extension office before spraying anything."],
  },
  mealybugs: {
    name: "Mealybugs",
    means: "Soft insects covered in white, cottony wax. They gather where leaves meet stems.",
    todo: ["Wipe them off where you can reach them.", "Check nearby plants, as they spread.", "Ask a garden center or the extension office about treatment."],
  },
  leafspot: {
    name: "A fungal leaf spot",
    means: "Spots with a darker edge are often a fungus, and it spreads in warm, wet weather.",
    todo: ["Water at the base, not over the leaves.", "Remove badly spotted leaves and clear fallen ones.", "Give the plant room for air to move."],
  },
  chewing: {
    name: "Caterpillars or other chewing insects",
    means: "Holes and missing edges mean something is eating the leaves, often at night.",
    todo: ["Look under the leaves and at night with a flashlight.", "Pick off caterpillars by hand on small plants.", "A little chewing rarely harms an established plant."],
  },
  salt: {
    name: "Salt or fertilizer burn",
    means: "Brown, crispy leaf edges can come from salty water, salt spray near the coast, or too much fertilizer.",
    todo: ["Water deeply to wash salt down past the roots.", "Cut back on fertilizer.", "Near the coast, choose plants listed as salt tolerant."],
  },
  cold: {
    name: "Cold damage",
    means: "Tropical plants show cold damage a few days after a cold night: blackened or brown leaves, sometimes soft stems.",
    todo: ["Wait. Do not prune until new growth shows what is alive, often several weeks.", "Water normally, and hold off on fertilizer until it warms up."],
  },
  rot: {
    name: "Rot at the base",
    means: "A soft, dark or bad-smelling base usually means rot, often from wet soil or a wound.",
    todo: ["Keep mulch and soil away from the trunk.", "Let the soil dry out.", "This one is serious: ask the extension office or a horticulturist."],
  },
  borers: {
    name: "Boring insects",
    means: "Holes in the trunk, sometimes with oozing sap or sawdust, can mean insects tunneling inside.",
    todo: ["Look for sawdust at the base and fresh holes.", "Keep the plant well watered: stressed plants are attacked more.", "Ask the extension office or an arborist to look at it."],
  },
  shock: {
    name: "Transplant shock",
    means: "Plants often wilt or drop leaves for a few weeks after planting while new roots grow.",
    todo: ["Keep the soil evenly moist, not wet, for the first weeks.", "Hold off on fertilizer until it is growing again."],
  },
};

const DOC_MATCHES = {
  "Turning yellow":                  { all: ["overwatering", "nutrients", "underwatering"], palm: ["nutrients"] },
  "Brown tips or edges":             { all: ["underwatering", "salt", "cold"] },
  "Spots":                           { all: ["leafspot", "scale"] },
  "Holes or chewed edges":           { all: ["chewing"] },
  "Sticky, or a black coating":      { all: ["scale", "mealybugs"] },
  "White fluffy bits":               { all: ["mealybugs", "scale"] },
  "Soft or rotting near the ground": { all: ["rot", "overwatering"] },
  "Holes or oozing sap":             { all: ["borers"] },
  "Wilting":                         { all: ["underwatering", "shock", "overwatering"] },
  "Dropping leaves":                 { all: ["shock", "overwatering", "underwatering"] },
  "Damaged after a cold night":      { all: ["cold"] },
};
