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
*/

const NURSERIES = [
  {
    id: "acreage-palms",
    name: "Acreage Palm Growers",
    city: "Loxahatchee",
    state: "FL",
    phone: "(555) 0142-0118",
    email: "sales@example.com",
    website: "https://example.com/acreage-palms",
    specialties: ["Palms", "Field grown"],
    minOrder: "$750",
    plants: [
      { common: "Coconut Palm", botanical: "Cocos nucifera 'Maypan'", size: "10-12 ft CT", quantity: 180 },
      { common: "Montgomery Palm", botanical: "Veitchia arecina", size: "8 ft CT", quantity: 240 },
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata", size: "#45", quantity: 320 },
      { common: "Sabal Palm", botanical: "Sabal palmetto", size: "12 ft CT", quantity: 600 },
      { common: "Areca Palm", botanical: "Dypsis lutescens", size: "#25", quantity: 450 }
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
      { common: "Clusia", botanical: "Clusia guttifera", size: "#7", quantity: 1400 },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus", size: "#15", quantity: 900 },
      { common: "Areca Palm", botanical: "Dypsis lutescens", size: "#15", quantity: 760 },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco 'Red Tip'", size: "#3", quantity: 2200 },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus", size: "#7", quantity: 640 }
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
      { common: "Live Oak", botanical: "Quercus virginiana", size: "3 in. caliper", quantity: 210 },
      { common: "Slash Pine", botanical: "Pinus elliottii", size: "#25", quantity: 340 },
      { common: "Green Buttonwood", botanical: "Conocarpus erectus", size: "#15", quantity: 480 },
      { common: "Firebush", botanical: "Hamelia patens", size: "#3", quantity: 1500 },
      { common: "Saw Palmetto", botanical: "Serenoa repens", size: "#7", quantity: 420 }
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
      { common: "Royal Poinciana", botanical: "Delonix regia", size: "#45", quantity: 90 },
      { common: "Tabebuia", botanical: "Handroanthus chrysotrichus", size: "#25", quantity: 150 },
      { common: "Bougainvillea", botanical: "Bougainvillea spectabilis", size: "#7", quantity: 850 },
      { common: "Hibiscus", botanical: "Hibiscus rosa-sinensis", size: "#3", quantity: 1900 },
      { common: "Frangipani", botanical: "Plumeria rubra", size: "#10", quantity: 260 }
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
      { common: "Live Oak", botanical: "Quercus virginiana", size: "4 in. caliper", quantity: 140 },
      { common: "Gumbo Limbo", botanical: "Bursera simaruba", size: "#45", quantity: 110 },
      { common: "Mahogany", botanical: "Swietenia mahagoni", size: "#30", quantity: 230 },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus", size: "#25", quantity: 175 },
      { common: "Simpson's Stopper", botanical: "Myrcianthes fragrans", size: "#15", quantity: 380 }
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
      { common: "Clusia", botanical: "Clusia rosea", size: "4 in. liner", quantity: 9000 },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco", size: "4 in. liner", quantity: 12000 },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus", size: "4 in. liner", quantity: 7500 },
      { common: "Firebush", botanical: "Hamelia patens", size: "2.5 in. liner", quantity: 15000 },
      { common: "Coontie", botanical: "Zamia integrifolia", size: "4 in. liner", quantity: 4000 }
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
      { common: "Dwarf Jasmine", botanical: "Trachelospermum asiaticum", size: "#1", quantity: 6500 },
      { common: "Liriope", botanical: "Liriope muscari 'Evergreen Giant'", size: "#1", quantity: 5200 },
      { common: "Perennial Peanut", botanical: "Arachis glabrata", size: "Flat", quantity: 800 },
      { common: "Blue Daze", botanical: "Evolvulus glomeratus", size: "#1", quantity: 3400 },
      { common: "Muhly Grass", botanical: "Muhlenbergia capillaris", size: "#3", quantity: 2100 }
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
      { common: "Mango", botanical: "Mangifera indica 'Glenn'", size: "#15", quantity: 460 },
      { common: "Avocado", botanical: "Persea americana 'Brogdon'", size: "#15", quantity: 380 },
      { common: "Lychee", botanical: "Litchi chinensis 'Mauritius'", size: "#7", quantity: 220 },
      { common: "Key Lime", botanical: "Citrus aurantiifolia", size: "#7", quantity: 540 },
      { common: "Starfruit", botanical: "Averrhoa carambola 'Kari'", size: "#10", quantity: 160 }
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
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata", size: "#65", quantity: 85 },
      { common: "Royal Palm", botanical: "Roystonea regia", size: "14 ft CT", quantity: 70 },
      { common: "Bismarck Palm", botanical: "Bismarckia nobilis", size: "#100", quantity: 45 },
      { common: "Traveler's Palm", botanical: "Ravenala madagascariensis", size: "#45", quantity: 120 },
      { common: "Bird of Paradise", botanical: "Strelitzia nicolai", size: "#25", quantity: 300 }
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
      { common: "Bird of Paradise", botanical: "Strelitzia reginae", size: "#7", quantity: 640 },
      { common: "Croton", botanical: "Codiaeum variegatum 'Petra'", size: "#3", quantity: 2400 },
      { common: "Ti Plant", botanical: "Cordyline fruticosa", size: "#3", quantity: 1800 },
      { common: "Agave", botanical: "Agave desmettiana", size: "#7", quantity: 520 },
      { common: "Philodendron Xanadu", botanical: "Thaumatophyllum xanadu", size: "#3", quantity: 3100 }
    ]
  }
];
