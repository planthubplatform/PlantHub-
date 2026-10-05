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

  What each field on a plant row means
  ------------------------------------
    common     The name a buyer searches for.        "Clusia"
    botanical  The Latin name, for exact matching.   "Clusia guttifera"
    size       The container, in trade shorthand.    "#7", "4 in. liner", "12 ft CT"
    grade      How the material is graded.           "Full", "Specimen", "Florida Fancy"
    quantity   Units on hand right now.              1400
    price      Wholesale per unit, or null for       24.5
               "call for pricing".
    updated    The date the nursery confirmed it.    "2026-09-30"

  Price and quantity are both deliberate. Every competing directory hides
  them behind a login; showing them is most of the reason this site exists.
  A grower who will not publish a price gets price: null, which the page
  shows as "Call" — that is honest, and better than an invented number.

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
      { common: "Coconut Palm", botanical: "Cocos nucifera 'Maypan'", size: "10-12 ft CT", grade: "Matched", quantity: 180, price: null, updated: "2026-09-29" },
      { common: "Montgomery Palm", botanical: "Veitchia arecina", size: "8 ft CT", grade: "Florida Fancy", quantity: 240, price: 326, updated: "2026-09-29" },
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata", size: "#45", grade: "Specimen", quantity: 320, price: 281.5, updated: "2026-09-28" },
      { common: "Sabal Palm", botanical: "Sabal palmetto", size: "12 ft CT", grade: "Full head", quantity: 600, price: 438, updated: "2026-09-29" },
      { common: "Areca Palm", botanical: "Dypsis lutescens", size: "#25", grade: "Standard", quantity: 450, price: 112.5, updated: "2026-09-27" }
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
      { common: "Clusia", botanical: "Clusia guttifera", size: "#7", grade: "Full", quantity: 1400, price: 19.25, updated: "2026-09-30" },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus", size: "#15", grade: "Multi", quantity: 900, price: 54.75, updated: "2026-09-30" },
      { common: "Areca Palm", botanical: "Dypsis lutescens", size: "#15", grade: "Standard", quantity: 760, price: null, updated: "2026-09-29" },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco 'Red Tip'", size: "#3", grade: "Bush", quantity: 2200, price: 9.25, updated: "2026-09-30" },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus", size: "#7", grade: "Full / low branched", quantity: 640, price: 21.5, updated: "2026-09-28" }
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
      { common: "Live Oak", botanical: "Quercus virginiana", size: "3 in. caliper", grade: "Grade #1", quantity: 210, price: 339.5, updated: "2026-09-08" },
      { common: "Slash Pine", botanical: "Pinus elliottii", size: "#25", grade: "Specimen", quantity: 340, price: 129.75, updated: "2026-09-05" },
      { common: "Green Buttonwood", botanical: "Conocarpus erectus", size: "#15", grade: "Multi", quantity: 480, price: null, updated: "2026-09-08" },
      { common: "Firebush", botanical: "Hamelia patens", size: "#3", grade: "Full", quantity: 1500, price: 8.75, updated: "2026-08-31" },
      { common: "Saw Palmetto", botanical: "Serenoa repens", size: "#7", grade: "Multi", quantity: 420, price: null, updated: "2026-09-03" }
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
      { common: "Royal Poinciana", botanical: "Delonix regia", size: "#45", grade: "Florida Fancy", quantity: 90, price: 200.75, updated: "2026-09-26" },
      { common: "Tabebuia", botanical: "Handroanthus chrysotrichus", size: "#25", grade: "Specimen", quantity: 150, price: 149.5, updated: "2026-09-24" },
      { common: "Bougainvillea", botanical: "Bougainvillea spectabilis", size: "#7", grade: "Full / low branched", quantity: 850, price: null, updated: "2026-09-26" },
      { common: "Hibiscus", botanical: "Hibiscus rosa-sinensis", size: "#3", grade: "Full", quantity: 1900, price: 10, updated: "2026-09-21" },
      { common: "Frangipani", botanical: "Plumeria rubra", size: "#10", grade: "Standard", quantity: 260, price: 43.25, updated: "2026-09-25" }
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
      { common: "Live Oak", botanical: "Quercus virginiana", size: "4 in. caliper", grade: "Grade #1", quantity: 140, price: 247.5, updated: "2026-06-26" },
      { common: "Gumbo Limbo", botanical: "Bursera simaruba", size: "#45", grade: "Florida Fancy", quantity: 110, price: 276, updated: "2026-06-12" },
      { common: "Mahogany", botanical: "Swietenia mahagoni", size: "#30", grade: "Standard", quantity: 230, price: 182, updated: "2026-06-26" },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus", size: "#25", grade: "Florida Fancy", quantity: 175, price: 158.5, updated: "2026-05-29" },
      { common: "Simpson's Stopper", botanical: "Myrcianthes fragrans", size: "#15", grade: "Full", quantity: 380, price: 65.75, updated: "2026-06-19" }
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
      { common: "Clusia", botanical: "Clusia rosea", size: "4 in. liner", grade: "Well rooted", quantity: 9000, price: 3, updated: "2026-09-28" },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco", size: "4 in. liner", grade: "Well rooted", quantity: 12000, price: 2.25, updated: "2026-09-27" },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus", size: "4 in. liner", grade: "Well rooted", quantity: 7500, price: 2, updated: "2026-09-28" },
      { common: "Firebush", botanical: "Hamelia patens", size: "2.5 in. liner", grade: "Shade grown", quantity: 15000, price: 3.25, updated: "2026-09-25" },
      { common: "Coontie", botanical: "Zamia integrifolia", size: "4 in. liner", grade: "Shade grown", quantity: 4000, price: 2.25, updated: "2026-09-27" }
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
      { common: "Dwarf Jasmine", botanical: "Trachelospermum asiaticum", size: "#1", grade: "Full", quantity: 6500, price: 2.4, updated: "2026-09-18" },
      { common: "Liriope", botanical: "Liriope muscari 'Evergreen Giant'", size: "#1", grade: "Full", quantity: 5200, price: 2.4, updated: "2026-09-16" },
      { common: "Perennial Peanut", botanical: "Arachis glabrata", size: "Flat", grade: "Well rooted", quantity: 800, price: 19.25, updated: "2026-09-18" },
      { common: "Blue Daze", botanical: "Evolvulus glomeratus", size: "#1", grade: "Full", quantity: 3400, price: 2.9, updated: "2026-09-12" },
      { common: "Muhly Grass", botanical: "Muhlenbergia capillaris", size: "#3", grade: "Full", quantity: 2100, price: null, updated: "2026-09-15" }
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
      { common: "Mango", botanical: "Mangifera indica 'Glenn'", size: "#15", grade: "Multi", quantity: 460, price: 52.25, updated: "2026-07-31" },
      { common: "Avocado", botanical: "Persea americana 'Brogdon'", size: "#15", grade: "Multi", quantity: 380, price: 64.25, updated: "2026-07-18" },
      { common: "Lychee", botanical: "Litchi chinensis 'Mauritius'", size: "#7", grade: "Full / low branched", quantity: 220, price: 26.75, updated: "2026-07-24" },
      { common: "Key Lime", botanical: "Citrus aurantiifolia", size: "#7", grade: "Full", quantity: 540, price: 22.5, updated: "2026-07-31" },
      { common: "Starfruit", botanical: "Averrhoa carambola 'Kari'", size: "#10", grade: "Standard", quantity: 160, price: null, updated: "2026-07-12" }
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
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata", size: "#65", grade: "Specimen", quantity: 85, price: 381.5, updated: "2026-09-14" },
      { common: "Royal Palm", botanical: "Roystonea regia", size: "14 ft CT", grade: "Matched", quantity: 70, price: 351.25, updated: "2026-09-11" },
      { common: "Bismarck Palm", botanical: "Bismarckia nobilis", size: "#100", grade: "Specimen", quantity: 45, price: 498.5, updated: "2026-09-14" },
      { common: "Traveler's Palm", botanical: "Ravenala madagascariensis", size: "#45", grade: "Matched", quantity: 120, price: 250.75, updated: "2026-09-07" },
      { common: "Bird of Paradise", botanical: "Strelitzia nicolai", size: "#25", grade: "Florida Fancy", quantity: 300, price: 118.75, updated: "2026-09-10" }
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
      { common: "Bird of Paradise", botanical: "Strelitzia reginae", size: "#7", grade: "Full", quantity: 640, price: 19.5, updated: "2026-09-29" },
      { common: "Croton", botanical: "Codiaeum variegatum 'Petra'", size: "#3", grade: "Full", quantity: 2400, price: 6.5, updated: "2026-09-28" },
      { common: "Ti Plant", botanical: "Cordyline fruticosa", size: "#3", grade: "Full", quantity: 1800, price: 10.25, updated: "2026-09-29" },
      { common: "Agave", botanical: "Agave desmettiana", size: "#7", grade: "Full / low branched", quantity: 520, price: null, updated: "2026-09-26" },
      { common: "Philodendron Xanadu", botanical: "Thaumatophyllum xanadu", size: "#3", grade: "Full / low branched", quantity: 3100, price: 7.5, updated: "2026-09-28" }
    ]
  }
];
