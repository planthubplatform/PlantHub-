/*
  PlantHub sample mileage
  =======================
  SAMPLE MILEAGE, NOT ROAD-ACCURATE. A delivery is priced by the miles from the
  grower to the buyer's job site. A real site would ask a mapping service for
  the driving distance. This preview has no such service, so it keeps the
  rough position of each city below and works the miles out from that:
  the straight line between the two, plus a fifth for the roads not being
  straight. Good enough to show how a delivery is priced, and nothing more.

  To add a city: add a line with its name and its position (latitude, then
  longitude; any map shows them). Every sample nursery's city must be here,
  or deliveries from it can't be priced.
*/

const CITY_POSITIONS = {
  "Acreage":            [26.79, -80.27],
  "Belle Glade":        [26.68, -80.67],
  "Boca Raton":         [26.37, -80.10],
  "Boynton Beach":      [26.53, -80.07],
  "Delray Beach":       [26.46, -80.07],
  "Fort Lauderdale":    [26.12, -80.14],
  "Homestead":          [25.47, -80.48],
  "Indiantown":         [27.03, -80.49],
  "Jupiter":            [26.93, -80.09],
  "Loxahatchee":        [26.68, -80.28],
  "Miami":              [25.76, -80.19],
  "Okeechobee":         [27.24, -80.83],
  "Palm Beach Gardens": [26.82, -80.14],
  "Port St. Lucie":     [27.27, -80.35],
  "Royal Palm Beach":   [26.71, -80.23],
  "Stuart":             [27.20, -80.25],
  "Wellington":         [26.66, -80.24],
  "West Palm Beach":    [26.71, -80.05]
};

// The cities a buyer can choose as a job site, in A to Z order.
const DELIVERY_CITIES = Object.keys(CITY_POSITIONS).sort();

// Find a city whatever way it was typed: "wellington", " Wellington ".
function cityPosition(name) {
  const wanted = String(name || "").trim().toLowerCase();
  const match = DELIVERY_CITIES.find(function (city) { return city.toLowerCase() === wanted; });
  return match ? CITY_POSITIONS[match] : null;
}

// Sample miles between two cities, or null when one of them isn't in the
// list. A trip inside one city still counts as 5 miles.
function milesBetween(from, to) {
  const a = cityPosition(from);
  const b = cityPosition(to);
  if (!a || !b) return null;

  // The standard sum for the distance between two points on a globe.
  const toRadians = Math.PI / 180;
  const dLat = (b[0] - a[0]) * toRadians;
  const dLon = (b[1] - a[1]) * toRadians;
  const half = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(a[0] * toRadians) * Math.cos(b[0] * toRadians) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const straightLine = 3959 * 2 * Math.atan2(Math.sqrt(half), Math.sqrt(1 - half));

  return Math.max(5, Math.round(straightLine * 1.2));
}
