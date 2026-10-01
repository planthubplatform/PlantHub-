/*
  PlantHub sample data — South Florida (Loxahatchee / Palm Beach County area)
  ===========================================================================
  SAMPLE DATA ONLY. Every nursery below is invented, and so is its availability,
  phone number and website. Nothing here describes a real business. Replace this
  file with real listings once you have gathered them.

  Why a .js file instead of a .json file?
  A browser refuses to load a .json file from your own hard drive for security
  reasons, so the page would look empty when you double-click index.html. Writing
  the data as a .js file avoids that, and you can still open it in any text editor.

  How to add a nursery: copy one { ... } block, paste it below, and edit the
  values. Keep the commas between blocks.

  The "updated" date on each plant
  --------------------------------
  Every plant row carries the date that nursery last confirmed the line, written
  as "YYYY-MM-DD". This is the thing none of our competitors show, so it is not
  optional: a row without a date is treated as unknown and sorts last.

  The site turns the date into plain words ("Updated 2 days ago") and a colour:
  green within a week, amber within a month, grey after that. Keeping these
  honest is the whole promise of the site — never guess a date to make a
  listing look fresher than it is.
*/

const NURSERIES = [
  {
    id: "acreage-palms",
    name: "Beautiful Gardens Growers",
    city: "Acreage",
    state: "FL",
    phone: "(555) 0142-0118",
    email: "sales@example.com",
    website: "https://example.com/acreage-palms",
    specialties: ["Palms", "Field grown"],
    minOrder: "$750",
    plants: [
      { common: "Coconut Palm", botanical: "Cocos nucifera 'Maypan'", size: "10-12 ft CT", quantity: 180, updated: "2026-09-29" },
      { common: "Montgomery Palm", botanical: "Veitchia arecina", size: "8 ft CT", quantity: 240, updated: "2026-09-29" },
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata", size: "#45", quantity: 320, updated: "2026-09-28" },
      { common: "Sabal Palm", botanical: "Sabal palmetto", size: "12 ft CT", quantity: 600, updated: "2026-09-29" },
      { common: "Areca Palm", botanical: "Dypsis lutescens", size: "#25", quantity: 450, updated: "2026-09-27" }
    ]
  },
  {
    id: "loxahatchee-hedge",
    name: "Loxahatchee Hedge Company",
    city: "Loxahatchee",
    state: "FL",
    phone: "(555) 0142-0233",
    email: "orders@example.com",
    website: "https://example.com/loxahatchee-hedge",
    specialties: ["Hedge material", "Privacy screens"],
    minOrder: "$500",
    plants: [
      { common: "Clusia", botanical: "Clusia guttifera", size: "#7", quantity: 1400, updated: "2026-09-30" },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus", size: "#15", quantity: 900, updated: "2026-09-30" },
      { common: "Areca Palm", botanical: "Dypsis lutescens", size: "#15", quantity: 760, updated: "2026-09-29" },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco 'Red Tip'", size: "#3", quantity: 2200, updated: "2026-09-30" },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus", size: "#7", quantity: 640, updated: "2026-09-28" }
    ]
  },
  {
    id: "everglades-natives",
    name: "Everglades Native Plant Farm",
    city: "Wellington",
    state: "FL",
    phone: "(555) 0142-0357",
    email: "hello@example.com",
    website: "https://example.com/everglades-natives",
    specialties: ["Florida natives", "Mitigation stock"],
    minOrder: "$350",
    plants: [
      { common: "Live Oak", botanical: "Quercus virginiana", size: "3 in. caliper", quantity: 210, updated: "2026-09-08" },
      { common: "Slash Pine", botanical: "Pinus elliottii", size: "#25", quantity: 340, updated: "2026-09-05" },
      { common: "Green Buttonwood", botanical: "Conocarpus erectus", size: "#15", quantity: 480, updated: "2026-09-08" },
      { common: "Firebush", botanical: "Hamelia patens", size: "#3", quantity: 1500, updated: "2026-08-31" },
      { common: "Saw Palmetto", botanical: "Serenoa repens", size: "#7", quantity: 420, updated: "2026-09-03" }
    ]
  },
  {
    id: "royal-palm-tropicals",
    name: "Royal Palm Tropicals",
    city: "Royal Palm Beach",
    state: "FL",
    phone: "(555) 0142-0461",
    email: "sales@example.com",
    website: "https://example.com/royal-palm-tropicals",
    specialties: ["Flowering trees", "Color"],
    minOrder: "$400",
    plants: [
      { common: "Royal Poinciana", botanical: "Delonix regia", size: "#45", quantity: 90, updated: "2026-09-26" },
      { common: "Tabebuia", botanical: "Handroanthus chrysotrichus", size: "#25", quantity: 150, updated: "2026-09-24" },
      { common: "Bougainvillea", botanical: "Bougainvillea spectabilis", size: "#7", quantity: 850, updated: "2026-09-26" },
      { common: "Hibiscus", botanical: "Hibiscus rosa-sinensis", size: "#3", quantity: 1900, updated: "2026-09-21" },
      { common: "Frangipani", botanical: "Plumeria rubra", size: "#10", quantity: 260, updated: "2026-09-25" }
    ]
  },
  {
    id: "jupiter-farms",
    name: "Jupiter Farms Tree Nursery",
    city: "Jupiter",
    state: "FL",
    phone: "(555) 0142-0572",
    email: "info@example.com",
    website: "https://example.com/jupiter-farms",
    specialties: ["Shade trees", "Street trees"],
    minOrder: "$600",
    plants: [
      { common: "Live Oak", botanical: "Quercus virginiana", size: "4 in. caliper", quantity: 140, updated: "2026-06-26" },
      { common: "Gumbo Limbo", botanical: "Bursera simaruba", size: "#45", quantity: 110, updated: "2026-06-12" },
      { common: "Mahogany", botanical: "Swietenia mahagoni", size: "#30", quantity: 230, updated: "2026-06-26" },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus", size: "#25", quantity: 175, updated: "2026-05-29" },
      { common: "Simpson's Stopper", botanical: "Myrcianthes fragrans", size: "#15", quantity: 380, updated: "2026-06-19" }
    ]
  },
  {
    id: "belle-glade-liners",
    name: "Belle Glade Liner Farm",
    city: "Belle Glade",
    state: "FL",
    phone: "(555) 0142-0688",
    email: "liners@example.com",
    website: "https://example.com/belle-glade-liners",
    specialties: ["Liners", "Starter plants"],
    minOrder: "$1,000",
    plants: [
      { common: "Clusia", botanical: "Clusia rosea", size: "4 in. liner", quantity: 9000, updated: "2026-09-28" },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco", size: "4 in. liner", quantity: 12000, updated: "2026-09-27" },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus", size: "4 in. liner", quantity: 7500, updated: "2026-09-28" },
      { common: "Firebush", botanical: "Hamelia patens", size: "2.5 in. liner", quantity: 15000, updated: "2026-09-25" },
      { common: "Coontie", botanical: "Zamia integrifolia", size: "4 in. liner", quantity: 4000, updated: "2026-09-27" }
    ]
  },
  {
    id: "delray-groundcover",
    name: "Delray Groundcover Growers",
    city: "Delray Beach",
    state: "FL",
    phone: "(555) 0142-0794",
    email: "sales@example.com",
    website: "https://example.com/delray-groundcover",
    specialties: ["Groundcover", "Annuals"],
    minOrder: "$250",
    plants: [
      { common: "Dwarf Jasmine", botanical: "Trachelospermum asiaticum", size: "#1", quantity: 6500, updated: "2026-09-18" },
      { common: "Liriope", botanical: "Liriope muscari 'Evergreen Giant'", size: "#1", quantity: 5200, updated: "2026-09-16" },
      { common: "Perennial Peanut", botanical: "Arachis glabrata", size: "Flat", quantity: 800, updated: "2026-09-18" },
      { common: "Blue Daze", botanical: "Evolvulus glomeratus", size: "#1", quantity: 3400, updated: "2026-09-12" },
      { common: "Muhly Grass", botanical: "Muhlenbergia capillaris", size: "#3", quantity: 2100, updated: "2026-09-15" }
    ]
  },
  {
    id: "homestead-tropical",
    name: "Homestead Tropical Fruit Co.",
    city: "Homestead",
    state: "FL",
    phone: "(555) 0142-0815",
    email: "fruit@example.com",
    website: "https://example.com/homestead-tropical",
    specialties: ["Fruit trees", "Grafted stock"],
    minOrder: "$400",
    plants: [
      { common: "Mango", botanical: "Mangifera indica 'Glenn'", size: "#15", quantity: 460, updated: "2026-07-31" },
      { common: "Avocado", botanical: "Persea americana 'Brogdon'", size: "#15", quantity: 380, updated: "2026-07-18" },
      { common: "Lychee", botanical: "Litchi chinensis 'Mauritius'", size: "#7", quantity: 220, updated: "2026-07-24" },
      { common: "Key Lime", botanical: "Citrus aurantiifolia", size: "#7", quantity: 540, updated: "2026-07-31" },
      { common: "Starfruit", botanical: "Averrhoa carambola 'Kari'", size: "#10", quantity: 160, updated: "2026-07-12" }
    ]
  },
  {
    id: "okeechobee-container",
    name: "Okeechobee Container Yard",
    city: "Okeechobee",
    state: "FL",
    phone: "(555) 0142-0926",
    email: "yard@example.com",
    website: "https://example.com/okeechobee-container",
    specialties: ["Large containers", "Landscape ready"],
    minOrder: "$800",
    plants: [
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata", size: "#65", quantity: 85, updated: "2026-09-14" },
      { common: "Royal Palm", botanical: "Roystonea regia", size: "14 ft CT", quantity: 70, updated: "2026-09-11" },
      { common: "Bismarck Palm", botanical: "Bismarckia nobilis", size: "#100", quantity: 45, updated: "2026-09-14" },
      { common: "Traveler's Palm", botanical: "Ravenala madagascariensis", size: "#45", quantity: 120, updated: "2026-09-07" },
      { common: "Bird of Paradise", botanical: "Strelitzia nicolai", size: "#25", quantity: 300, updated: "2026-09-10" }
    ]
  },
  {
    id: "indiantown-wholesale",
    name: "Indiantown Wholesale Nursery",
    city: "Indiantown",
    state: "FL",
    phone: "(555) 0142-1037",
    email: "orders@example.com",
    website: "https://example.com/indiantown-wholesale",
    specialties: ["Accent plants", "Tropical foliage"],
    minOrder: "$300",
    plants: [
      { common: "Bird of Paradise", botanical: "Strelitzia reginae", size: "#7", quantity: 640, updated: "2026-09-29" },
      { common: "Croton", botanical: "Codiaeum variegatum 'Petra'", size: "#3", quantity: 2400, updated: "2026-09-28" },
      { common: "Ti Plant", botanical: "Cordyline fruticosa", size: "#3", quantity: 1800, updated: "2026-09-29" },
      { common: "Agave", botanical: "Agave desmettiana", size: "#7", quantity: 520, updated: "2026-09-26" },
      { common: "Philodendron Xanadu", botanical: "Thaumatophyllum xanadu", size: "#3", quantity: 3100, updated: "2026-09-28" }
    ]
  }
];
