/*
  PlantHub plant encyclopedia (DRAFT)
  ===================================
  DRAFT, NOT YET REVIEWED BY A HORTICULTURIST. The notes below are general
  knowledge about common South Florida landscape plants, written for
  beginners. Check them before relying on them; the page says so too.

  SKELETON: there is one entry for every plant that appears in the sample
  listings (data/nurseries.js), so each one can be found here. Only some are
  written so far. An entry with no "about" shows as "not written yet".

  How to write an entry: fill in the fields of its { ... } block.
    name       Must match the "common" name in the listings exactly, so the
               encyclopedia can say who sells it.          "Sabal Palm"
    botanical  The Latin name.                              "Sabal palmetto"
    type       One of: Palm, Tree, Shrub, Groundcover, Other.
    about      One or two plain sentences: what it is, what it is used for.
    light, water, size, cold, salt
               Short answers a beginner can act on.
    problems   The usual troubles, in a sentence.
    trade      One line for the trade: how it is usually sold and used.

  How to add a plant: copy a block, paste it in A to Z order, and fill it in.
*/

const PLANTS = [
  { name: "Agave", botanical: "Agave desmettiana", type: "Other" },

  { name: "Areca Palm", botanical: "Dypsis lutescens", type: "Palm",
    about: "A clumping palm with feathery, yellow-green fronds. One of the most planted screening palms in South Florida.",
    light: "Bright light to part shade. Full sun can yellow the fronds.",
    water: "Regular water. Let the top of the soil dry between waterings.",
    size: "15 to 25 ft tall, 8 to 15 ft wide",
    cold: "Damaged at around 32°F",
    salt: "Moderate",
    problems: "Yellowing from a lack of potassium or magnesium; scale and spider mites.",
    trade: "Sold in containers from 3G to 45G, usually as a multi-stem clump for screens." },

  { name: "Avocado", botanical: "Persea americana", type: "Tree" },
  { name: "Bird of Paradise", botanical: "Strelitzia", type: "Other" },
  { name: "Bismarck Palm", botanical: "Bismarckia nobilis", type: "Palm" },
  { name: "Blue Daze", botanical: "Evolvulus glomeratus", type: "Groundcover" },

  { name: "Bougainvillea", botanical: "Bougainvillea spectabilis", type: "Shrub",
    about: "A thorny vine or shrub grown for its sheets of bright color. It flowers best when kept a little dry.",
    light: "Full sun",
    water: "Low once established. Too much water means leaves instead of flowers.",
    size: "5 to 20 ft or more, depending on how it is trained and pruned",
    cold: "Damaged below about 30°F",
    salt: "Moderate to high",
    problems: "Thorns; caterpillars that chew the leaves; few flowers when overwatered or overfed.",
    trade: "Sold in 3G and 15G containers, often staked or on a trellis." },

  { name: "Clusia", botanical: "Clusia guttifera", type: "Shrub",
    about: "A dense shrub with thick, rounded leaves. The go-to hedge in South Florida for privacy screens.",
    light: "Full sun to part shade",
    water: "Low to moderate once established. Does not like wet feet.",
    size: "Usually kept as a 4 to 10 ft hedge; can grow taller",
    cold: "Damaged below about 30°F",
    salt: "High",
    problems: "Thrips and scale on the leaves; root rot in soggy soil.",
    trade: "Sold from liners up to 15G and larger for instant hedges." },

  { name: "Coconut Palm", botanical: "Cocos nucifera", type: "Palm",
    about: "The classic tropical palm, with a curved trunk and long feathery fronds. 'Maypan' is grown for resistance to lethal yellowing.",
    light: "Full sun",
    water: "Moderate",
    size: "50 to 80 ft tall in time",
    cold: "Tender. Damaged when it drops near 35°F to 40°F.",
    salt: "High",
    problems: "Lethal yellowing disease; falling coconuts near walks and parking.",
    trade: "Usually sold field grown, by height or clear trunk." },

  { name: "Cocoplum", botanical: "Chrysobalanus icaco", type: "Shrub",
    about: "A native shrub with round leathery leaves, used for hedges. The 'Red Tip' form has red new growth.",
    light: "Full sun to part shade",
    water: "Low to moderate once established",
    size: "Kept as a 3 to 10 ft hedge; can reach 15 ft",
    cold: "Damaged by frost",
    salt: "High for the green native form, moderate for 'Red Tip'",
    problems: "Scale and the black sooty mold that follows it; leaf spot in wet weather.",
    trade: "Sold as liners and in 3G containers for hedging." },

  { name: "Coontie", botanical: "Zamia integrifolia", type: "Other" },
  { name: "Croton", botanical: "Codiaeum variegatum", type: "Shrub" },
  { name: "Dwarf Jasmine", botanical: "Trachelospermum asiaticum", type: "Groundcover" },

  { name: "Firebush", botanical: "Hamelia patens", type: "Shrub",
    about: "A native shrub with red-orange tube flowers most of the year. Butterflies and hummingbirds come to it.",
    light: "Full sun to part shade. Flowers most in sun.",
    water: "Low once established",
    size: "5 to 10 ft tall and wide; can be kept smaller",
    cold: "Dies back in a frost and grows again from the base",
    salt: "Low to moderate",
    problems: "Few. Mites in very dry weather.",
    trade: "Sold as liners and in 3G containers." },

  { name: "Foxtail Palm", botanical: "Wodyetia bifurcata", type: "Palm",
    about: "A fast-growing palm with fronds as full as a fox's tail. Popular as a single specimen or in pairs.",
    light: "Full sun",
    water: "Moderate",
    size: "20 to 30 ft tall",
    cold: "Damaged below about 30°F",
    salt: "Moderate",
    problems: "Frizzled or yellow fronds from a lack of potassium or magnesium.",
    trade: "Sold in 45G and 100G containers and field grown, often as singles or doubles." },

  { name: "Frangipani", botanical: "Plumeria rubra", type: "Tree" },
  { name: "Green Buttonwood", botanical: "Conocarpus erectus", type: "Tree" },
  { name: "Gumbo Limbo", botanical: "Bursera simaruba", type: "Tree" },
  { name: "Hibiscus", botanical: "Hibiscus rosa-sinensis", type: "Shrub" },
  { name: "Key Lime", botanical: "Citrus aurantiifolia", type: "Tree" },
  { name: "Liriope", botanical: "Liriope muscari", type: "Groundcover" },

  { name: "Live Oak", botanical: "Quercus virginiana", type: "Tree",
    about: "A long-lived native shade tree with a wide, spreading crown. The street and park tree of the South.",
    light: "Full sun",
    water: "Low once established",
    size: "40 to 60 ft tall and much wider. Give it room.",
    cold: "Very cold hardy",
    salt: "Moderate to high",
    problems: "Few. Roots lift pavement planted too close; needs pruning for structure when young.",
    trade: "Sold field grown by caliper, usually balled and burlapped, single leader." },

  { name: "Lychee", botanical: "Litchi chinensis", type: "Tree" },
  { name: "Mahogany", botanical: "Swietenia mahagoni", type: "Tree" },
  { name: "Mango", botanical: "Mangifera indica", type: "Tree" },
  { name: "Montgomery Palm", botanical: "Veitchia arecina", type: "Palm" },

  { name: "Muhly Grass", botanical: "Muhlenbergia capillaris", type: "Groundcover",
    about: "A native clumping grass that turns into a cloud of pink plumes in the fall.",
    light: "Full sun",
    water: "Low once established",
    size: "2 to 3 ft tall and wide",
    cold: "Cold hardy",
    salt: "Moderate to high",
    problems: "Few. Rots in soil that stays wet.",
    trade: "Sold in 1G and 3G containers for mass plantings." },

  { name: "Perennial Peanut", botanical: "Arachis glabrata", type: "Groundcover" },
  { name: "Philodendron Xanadu", botanical: "Thaumatophyllum xanadu", type: "Shrub" },
  { name: "Podocarpus", botanical: "Podocarpus macrophyllus", type: "Shrub" },
  { name: "Royal Palm", botanical: "Roystonea regia", type: "Palm" },
  { name: "Royal Poinciana", botanical: "Delonix regia", type: "Tree" },

  { name: "Sabal Palm", botanical: "Sabal palmetto", type: "Palm",
    about: "Florida's state tree. A tough native palm with fan-shaped leaves, usually planted for its tall, clean trunk.",
    light: "Full sun to part shade",
    water: "Low once established",
    size: "40 to 50 ft tall in time",
    cold: "Cold hardy for a palm, to about 15°F",
    salt: "High",
    problems: "Palm weevils; a trunk rot near the base on older palms.",
    trade: "Usually sold field grown by clear trunk height, balled and burlapped." },

  { name: "Saw Palmetto", botanical: "Serenoa repens", type: "Palm" },
  { name: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus", type: "Shrub" },
  { name: "Simpson's Stopper", botanical: "Myrcianthes fragrans", type: "Shrub" },
  { name: "Slash Pine", botanical: "Pinus elliottii", type: "Tree" },
  { name: "Starfruit", botanical: "Averrhoa carambola", type: "Tree" },
  { name: "Tabebuia", botanical: "Handroanthus chrysotrichus", type: "Tree" },
  { name: "Ti Plant", botanical: "Cordyline fruticosa", type: "Shrub" },
  { name: "Traveler's Palm", botanical: "Ravenala madagascariensis", type: "Other" },
];
