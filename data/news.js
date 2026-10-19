/*
  PlantHub news (SAMPLE ARTICLES)
  ===============================
  SAMPLE ONLY. Every article below is invented to show how the news page
  works. None is copied from a real publication, none reports a real event,
  and the page labels each one "Sample article".

  SKELETON: a handful of short articles in three topics. To add one, copy a
  { ... } block and fill it in.
    id         Short, lowercase, words joined by hyphens. Used in the address.
    topic      One of the TOPICS below.
    daysAgo    How many days before today it is dated. Samples use a count
               instead of a date so the page never looks out of date.
    title      Plain and specific.
    summary    One or two sentences, shown in the list.
    body       The article, one string per paragraph.
*/

const TOPICS = ["Market and prices", "Pest and disease alerts", "Weather and storm preparation"];

const ARTICLES = [
  {
    id: "dry-season-palm-demand",
    topic: "Market and prices",
    daysAgo: 3,
    title: "Palm orders pick up as the dry season starts",
    summary: "Landscape crews book more palm installs once the rains ease. Growers who keep availability current are the ones who get the calls.",
    body: [
      "Late fall is when many South Florida landscape projects that waited out the rainy season come back on the schedule. Palms are often the first item on those plans, and they are also the item with the longest wait when stock is short.",
      "For buyers, the practical advice is to check availability before bidding a job, not after winning it. A listing confirmed this week is a better guide than a price sheet from last month.",
      "For growers, this is the time to confirm counts on field-grown stock and to note clear trunk heights, since that is what most palm orders are written around.",
    ],
  },
  {
    id: "scale-on-hedges",
    topic: "Pest and disease alerts",
    daysAgo: 9,
    title: "Check hedge material for scale after a wet summer",
    summary: "Scale insects and the black sooty mold that follows them are common on clusia and cocoplum after long stretches of humid weather.",
    body: [
      "Scale insects are small, still bumps on stems and the undersides of leaves. They feed on sap and leave a sticky residue that black sooty mold grows on.",
      "Before buying hedge material, look under a few leaves on several plants. A little scale is common; leaves coated black, or many yellowing leaves, are a reason to ask the grower questions first.",
      "Plant Doc can help narrow down what you are looking at. A local extension office can confirm it.",
    ],
  },
  {
    id: "nursery-storm-checklist",
    topic: "Weather and storm preparation",
    daysAgo: 16,
    title: "A short storm checklist for nurseries and job sites",
    summary: "What to do in the days before a tropical storm: lay down tall containers, secure loose material, and clear the drains.",
    body: [
      "Lay tall container plants on their sides in the direction the wind is expected to come from, so they are not thrown around. Group smaller containers together against a wall or fence.",
      "Stake or guy newly planted trees that have not rooted in yet, and pull anything loose off the site: empty pots, shade cloth, tools and stakes.",
      "Clear drains and low spots before the rain arrives. Standing water after a storm does more damage to roots than the wind does to leaves.",
    ],
  },
  {
    id: "liner-availability",
    topic: "Market and prices",
    daysAgo: 24,
    title: "Liner stock for spring hedges is being booked now",
    summary: "Growers starting hedge material for spring jobs are buying liners in the fall. Quantities of the most common hedges go first.",
    body: [
      "Liners are the small starter plants that growers pot up and grow on. A clusia or cocoplum hedge planted in spring was usually a liner the fall before.",
      "If you know you will need a large run of one hedge in spring, talking to a grower now gives them time to grow it for you.",
    ],
  },
];
