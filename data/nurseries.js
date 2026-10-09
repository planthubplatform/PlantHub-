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
  Every listing is described in four separate ways, matching the four filters
  on the directory page. A value belongs to exactly one of them: "Field Grown"
  is a container, never a grade; "Standard" is a grade, never a container.

    common      The name a buyer searches for.            "Clusia"
    botanical   The Latin name, for exact matching.       "Clusia guttifera"

    1. container  ONE value from the pick list in app.js (CONTAINERS).
                  "3G / 10\"", "Field Grown", "Liners", "60\" Box" ...

    2. specs      Measurements, as plain numbers. Leave out any that weren't measured.
         caliper     trunk thickness, in INCHES        2.5
         height      in FEET (use 0.5 for 6 inches)     10
         spread      in FEET                            6
         clearTrunk  bare trunk below the head, FEET    8

    3. grades     A list, from the GRADES list in app.js.  ["Florida Fancy", "Staked"]

    4. photos     How many photos the listing has. 0 for none.   2

    quantity    EXACT units on hand. Never a bucket like "100+".   1400
    price       Wholesale per unit, in dollars. Required: buyers pay in full
                at checkout, so every listing needs a real price.    24.5
    updated     The date the nursery confirmed it, "YYYY-MM-DD".

  The "updated" date on each plant
  --------------------------------
  This is the thing none of our competitors show, so it is not optional: a row
  without a date is treated as unknown and sorts last. The site turns the date
  into plain words ("Updated 2 days ago") and a colour: green within a week,
  amber within a month, grey after that. Keeping these honest is the whole
  promise of the site — never guess a date to make a listing look fresher.

  Contact details (phone, email, website) are kept here, but the page only
  offers them to signed-in users: contacting a grower needs an account.
*/

const NURSERIES = [
  {
    id: "acreage-palms",
    name: "Sample Grower 01 (Palms)",
    city: "Acreage",
    state: "FL",
    phone: "(555) 0142-0118",
    email: "sales@example.com",
    website: "https://example.com/acreage-palms",
    specialties: ["Palms", "Field grown"],
    plants: [
      { common: "Coconut Palm", botanical: "Cocos nucifera 'Maypan'",
        container: "Field Grown", height: 16, clearTrunk: 11,
        grades: ["Specimen"], photos: 3,
        quantity: 180, price: 560, updated: "2026-09-29" },
      { common: "Montgomery Palm", botanical: "Veitchia arecina",
        container: "Field Grown", height: 14, clearTrunk: 8,
        grades: ["Florida Fancy"], photos: 2,
        quantity: 240, price: 326, updated: "2026-09-29" },
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata",
        container: "45G / 28\"", height: 9, spread: 6,
        grades: ["Specimen"], photos: 2,
        quantity: 320, price: 281.5, updated: "2026-09-28" },
      { common: "Sabal Palm", botanical: "Sabal palmetto",
        container: "Field Grown", height: 18, clearTrunk: 12,
        grades: ["Florida Fancy", "Balled and Burlapped"], photos: 1,
        quantity: 600, price: 438, updated: "2026-09-29" },
      { common: "Areca Palm", botanical: "Dypsis lutescens",
        container: "45G / 28\"", height: 8, spread: 5,
        grades: ["Standard", "Multi"], photos: 0,
        quantity: 450, price: 112.5, updated: "2026-09-27" }
    ]
  },
  {
    id: "loxahatchee-hedge",
    name: "Sample Grower 02 (Hedges)",
    city: "Loxahatchee",
    state: "FL",
    phone: "(555) 0142-0233",
    email: "orders@example.com",
    website: "https://example.com/loxahatchee-hedge",
    specialties: ["Hedge material", "Privacy screens"],
    plants: [
      { common: "Clusia", botanical: "Clusia guttifera",
        container: "15G / 17\"", height: 4, spread: 2.5,
        grades: ["Grade #1"], photos: 2,
        quantity: 1400, price: 19.25, updated: "2026-09-30" },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus",
        container: "15G / 17\"", height: 5, spread: 2,
        grades: ["Multi"], photos: 1,
        quantity: 900, price: 54.75, updated: "2026-09-30" },
      { common: "Areca Palm", botanical: "Dypsis lutescens",
        container: "15G / 17\"", height: 6, spread: 3,
        grades: ["Standard", "Multi"], photos: 0,
        quantity: 760, price: 48.5, updated: "2026-09-29" },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco 'Red Tip'",
        container: "3G / 10\"", height: 2, spread: 1.5,
        grades: ["Grade #1", "Multi"], photos: 0,
        quantity: 2200, price: 9.25, updated: "2026-09-30" },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus",
        container: "15G / 17\"", height: 4, spread: 3,
        grades: ["Grade #1", "Multi"], photos: 1,
        quantity: 640, price: 21.5, updated: "2026-09-28" }
    ]
  },
  {
    id: "everglades-natives",
    name: "Sample Grower 03 (Natives)",
    city: "Wellington",
    state: "FL",
    phone: "(555) 0142-0357",
    email: "hello@example.com",
    website: "https://example.com/everglades-natives",
    specialties: ["Florida natives", "Mitigation stock"],
    plants: [
      { common: "Live Oak", botanical: "Quercus virginiana",
        container: "Field Grown", caliper: 3, height: 12, spread: 6, clearTrunk: 5,
        grades: ["Grade #1", "Single Leader", "Balled and Burlapped", "Staked"], photos: 2,
        quantity: 210, price: 339.5, updated: "2026-09-08" },
      { common: "Slash Pine", botanical: "Pinus elliottii",
        container: "45G / 28\"", caliper: 2, height: 10,
        grades: ["Specimen", "Single Leader"], photos: 0,
        quantity: 340, price: 129.75, updated: "2026-09-05" },
      { common: "Green Buttonwood", botanical: "Conocarpus erectus",
        container: "15G / 17\"", height: 5, spread: 3,
        grades: ["Multi"], photos: 0,
        quantity: 480, price: 46.75, updated: "2026-09-08" },
      { common: "Firebush", botanical: "Hamelia patens",
        container: "3G / 10\"", height: 2.5, spread: 1.5,
        grades: ["Grade #1"], photos: 1,
        quantity: 1500, price: 8.75, updated: "2026-08-31" },
      { common: "Saw Palmetto", botanical: "Serenoa repens",
        container: "15G / 17\"", height: 2.5, spread: 3,
        grades: ["Multi"], photos: 0,
        quantity: 420, price: 38.5, updated: "2026-09-03" }
    ]
  },
  {
    id: "royal-palm-tropicals",
    name: "Sample Grower 04 (Tropicals)",
    city: "Royal Palm Beach",
    state: "FL",
    phone: "(555) 0142-0461",
    email: "sales@example.com",
    website: "https://example.com/royal-palm-tropicals",
    specialties: ["Flowering trees", "Color"],
    plants: [
      { common: "Royal Poinciana", botanical: "Delonix regia",
        container: "45G / 28\"", caliper: 2.5, height: 10, spread: 5,
        grades: ["Florida Fancy", "Single Leader", "Staked"], photos: 3,
        quantity: 90, price: 200.75, updated: "2026-09-26" },
      { common: "Tabebuia", botanical: "Handroanthus chrysotrichus",
        container: "45G / 28\"", caliper: 2, height: 9, spread: 4,
        grades: ["Specimen", "Staked"], photos: 2,
        quantity: 150, price: 149.5, updated: "2026-09-24" },
      { common: "Bougainvillea", botanical: "Bougainvillea spectabilis",
        container: "15G / 17\"", height: 4, spread: 3,
        grades: ["Grade #1", "Staked"], photos: 2,
        quantity: 850, price: 24.75, updated: "2026-09-26" },
      { common: "Hibiscus", botanical: "Hibiscus rosa-sinensis",
        container: "3G / 10\"", height: 2.5, spread: 1.5,
        grades: ["Grade #1"], photos: 1,
        quantity: 1900, price: 10, updated: "2026-09-21" },
      { common: "Frangipani", botanical: "Plumeria rubra",
        container: "15G / 17\"", height: 5, spread: 3,
        grades: ["Standard"], photos: 0,
        quantity: 260, price: 43.25, updated: "2026-09-25" }
    ]
  },
  {
    id: "jupiter-farms",
    name: "Sample Grower 05 (Trees)",
    city: "Jupiter",
    state: "FL",
    phone: "(555) 0142-0572",
    email: "info@example.com",
    website: "https://example.com/jupiter-farms",
    specialties: ["Shade trees", "Street trees"],
    plants: [
      { common: "Live Oak", botanical: "Quercus virginiana",
        container: "Field Grown", caliper: 4, height: 14, spread: 7, clearTrunk: 6,
        grades: ["Grade #1", "Single Leader", "Balled and Burlapped"], photos: 0,
        quantity: 140, price: 247.5, updated: "2026-06-26" },
      { common: "Gumbo Limbo", botanical: "Bursera simaruba",
        container: "45G / 28\"", caliper: 3, height: 12, spread: 5,
        grades: ["Florida Fancy", "Single Leader"], photos: 1,
        quantity: 110, price: 276, updated: "2026-06-12" },
      { common: "Mahogany", botanical: "Swietenia mahagoni",
        container: "45G / 28\"", caliper: 2.5, height: 11, spread: 5,
        grades: ["Standard", "Single Leader", "Staked"], photos: 0,
        quantity: 230, price: 182, updated: "2026-06-26" },
      { common: "Silver Buttonwood", botanical: "Conocarpus erectus var. sericeus",
        container: "45G / 28\"", height: 8, spread: 5,
        grades: ["Florida Fancy", "Standard"], photos: 1,
        quantity: 175, price: 158.5, updated: "2026-05-29" },
      { common: "Simpson's Stopper", botanical: "Myrcianthes fragrans",
        container: "15G / 17\"", height: 5, spread: 2.5,
        grades: ["Grade #1"], photos: 0,
        quantity: 380, price: 65.75, updated: "2026-06-19" }
    ]
  },
  {
    id: "belle-glade-liners",
    name: "Sample Grower 06 (Liners)",
    city: "Belle Glade",
    state: "FL",
    phone: "(555) 0142-0688",
    email: "liners@example.com",
    website: "https://example.com/belle-glade-liners",
    specialties: ["Liners", "Starter plants"],
    plants: [
      { common: "Clusia", botanical: "Clusia rosea",
        container: "Liners", height: 0.5,
        grades: ["Grade #1"], photos: 0,
        quantity: 9000, price: 3, updated: "2026-09-28" },
      { common: "Cocoplum", botanical: "Chrysobalanus icaco",
        container: "Liners", height: 0.5,
        grades: ["Grade #1"], photos: 0,
        quantity: 12000, price: 2.25, updated: "2026-09-27" },
      { common: "Podocarpus", botanical: "Podocarpus macrophyllus",
        container: "Liners", height: 0.5,
        grades: ["Grade #1"], photos: 0,
        quantity: 7500, price: 2, updated: "2026-09-28" },
      { common: "Firebush", botanical: "Hamelia patens",
        container: "Liners", height: 0.33,
        grades: ["Seedling"], photos: 0,
        quantity: 15000, price: 3.25, updated: "2026-09-25" },
      { common: "Coontie", botanical: "Zamia integrifolia",
        container: "Liners", height: 0.5,
        grades: ["Grade #2"], photos: 0,
        quantity: 4000, price: 2.25, updated: "2026-09-27" }
    ]
  },
  {
    id: "delray-groundcover",
    name: "Sample Grower 07 (Groundcover)",
    city: "Delray Beach",
    state: "FL",
    phone: "(555) 0142-0794",
    email: "sales@example.com",
    website: "https://example.com/delray-groundcover",
    specialties: ["Groundcover", "Annuals"],
    plants: [
      { common: "Dwarf Jasmine", botanical: "Trachelospermum asiaticum",
        container: "1G / 6\"", spread: 1,
        grades: ["Grade #1"], photos: 1,
        quantity: 6500, price: 2.4, updated: "2026-09-18" },
      { common: "Liriope", botanical: "Liriope muscari 'Evergreen Giant'",
        container: "1G / 6\"", height: 1, spread: 1,
        grades: ["Grade #1"], photos: 1,
        quantity: 5200, price: 2.4, updated: "2026-09-16" },
      { common: "Perennial Peanut", botanical: "Arachis glabrata",
        container: "5\" Quart", spread: 0.75,
        grades: ["Grade #1"], photos: 0,
        quantity: 800, price: 19.25, updated: "2026-09-18" },
      { common: "Blue Daze", botanical: "Evolvulus glomeratus",
        container: "1G / 6\"", spread: 1,
        grades: ["Grade #1"], photos: 0,
        quantity: 3400, price: 2.9, updated: "2026-09-12" },
      { common: "Muhly Grass", botanical: "Muhlenbergia capillaris",
        container: "3G / 10\"", height: 1.5, spread: 1.5,
        grades: ["Grade #1"], photos: 1,
        quantity: 2100, price: 7.25, updated: "2026-09-15" }
    ]
  },
  {
    id: "homestead-tropical",
    name: "Sample Grower 08 (Fruit Trees)",
    city: "Homestead",
    state: "FL",
    phone: "(555) 0142-0815",
    email: "fruit@example.com",
    website: "https://example.com/homestead-tropical",
    specialties: ["Fruit trees", "Grafted stock"],
    plants: [
      { common: "Mango", botanical: "Mangifera indica 'Glenn'",
        container: "15G / 17\"", caliper: 1, height: 5,
        grades: ["Multi"], photos: 2,
        quantity: 460, price: 52.25, updated: "2026-07-31" },
      { common: "Avocado", botanical: "Persea americana 'Brogdon'",
        container: "15G / 17\"", caliper: 1, height: 5,
        grades: ["Multi"], photos: 1,
        quantity: 380, price: 64.25, updated: "2026-07-18" },
      { common: "Lychee", botanical: "Litchi chinensis 'Mauritius'",
        container: "15G / 17\"", height: 4, spread: 3,
        grades: ["Grade #1", "Multi"], photos: 0,
        quantity: 220, price: 26.75, updated: "2026-07-24" },
      { common: "Key Lime", botanical: "Citrus aurantiifolia",
        container: "15G / 17\"", height: 4, spread: 2.5,
        grades: ["Grade #1"], photos: 0,
        quantity: 540, price: 22.5, updated: "2026-07-31" },
      { common: "Starfruit", botanical: "Averrhoa carambola 'Kari'",
        container: "15G / 17\"", height: 5, spread: 2.5,
        grades: ["Standard", "Staked"], photos: 0,
        quantity: 160, price: 44.5, updated: "2026-07-12" }
    ]
  },
  {
    id: "okeechobee-container",
    name: "Sample Grower 09 (Containers)",
    city: "Okeechobee",
    state: "FL",
    phone: "(555) 0142-0926",
    email: "yard@example.com",
    website: "https://example.com/okeechobee-container",
    specialties: ["Large containers", "Landscape ready"],
    plants: [
      { common: "Foxtail Palm", botanical: "Wodyetia bifurcata",
        container: "100G / 36\"", height: 12, spread: 7, clearTrunk: 3,
        grades: ["Specimen"], photos: 3,
        quantity: 85, price: 381.5, updated: "2026-09-14" },
      { common: "Royal Palm", botanical: "Roystonea regia",
        container: "Field Grown", height: 22, clearTrunk: 14,
        grades: ["Specimen", "Balled and Burlapped"], photos: 2,
        quantity: 70, price: 351.25, updated: "2026-09-11" },
      { common: "Bismarck Palm", botanical: "Bismarckia nobilis",
        container: "100G / 36\"", height: 8, spread: 8,
        grades: ["Specimen"], photos: 2,
        quantity: 45, price: 498.5, updated: "2026-09-14" },
      { common: "Traveler's Palm", botanical: "Ravenala madagascariensis",
        container: "60\" Box", height: 12, spread: 8,
        grades: ["Specimen"], photos: 1,
        quantity: 120, price: 250.75, updated: "2026-09-07" },
      { common: "Bird of Paradise", botanical: "Strelitzia nicolai",
        container: "45G / 28\"", height: 7, spread: 4,
        grades: ["Florida Fancy", "Multi"], photos: 1,
        quantity: 300, price: 118.75, updated: "2026-09-10" }
    ]
  },
  {
    id: "indiantown-wholesale",
    name: "Sample Grower 10 (Mixed)",
    city: "Indiantown",
    state: "FL",
    phone: "(555) 0142-1037",
    email: "orders@example.com",
    website: "https://example.com/indiantown-wholesale",
    specialties: ["Accent plants", "Tropical foliage"],
    plants: [
      { common: "Bird of Paradise", botanical: "Strelitzia reginae",
        container: "15G / 17\"", height: 3.5, spread: 2.5,
        grades: ["Grade #1"], photos: 0,
        quantity: 640, price: 19.5, updated: "2026-09-29" },
      { common: "Croton", botanical: "Codiaeum variegatum 'Petra'",
        container: "3G / 10\"", height: 1.5, spread: 1.5,
        grades: ["Grade #1"], photos: 1,
        quantity: 2400, price: 6.5, updated: "2026-09-28" },
      { common: "Ti Plant", botanical: "Cordyline fruticosa",
        container: "3G / 10\"", height: 2, spread: 1,
        grades: ["Grade #1"], photos: 0,
        quantity: 1800, price: 10.25, updated: "2026-09-29" },
      { common: "Agave", botanical: "Agave desmettiana",
        container: "15G / 17\"", height: 2.5, spread: 3,
        grades: ["Grade #1"], photos: 1,
        quantity: 520, price: 39.25, updated: "2026-09-26" },
      { common: "Philodendron Xanadu", botanical: "Thaumatophyllum xanadu",
        container: "3G / 10\"", height: 1.5, spread: 2,
        grades: ["Grade #1"], photos: 0,
        quantity: 3100, price: 7.5, updated: "2026-09-28" }
    ]
  }
];
