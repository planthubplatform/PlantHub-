/*
  PlantHub sample carriers
  ========================
  SAMPLE DATA ONLY. Every transport company below is invented, and so are its
  rates, equipment and insurance. Nothing here describes a real business.

  A carrier is a company that trucks plants from a grower to a buyer's job
  site. Buyers pick one after paying, and the delivery costs

      miles from the grower to the job site  x  the carrier's rate per mile

  or the carrier's per-trip minimum if that is higher.

  What each field means
  ---------------------
    id                 Never changes, so orders can point at the carrier.
    name               "Sample Carrier 01 (Flatbed)": the word Sample stays.
    city               Where the trucks are based.
    ratePerMile        Dollars per mile.                              4.25
    tripMinimum        The least a trip costs, however short.         175
    plantTypes         From HAUL_TYPES in shared.js.
    sizes              From HAUL_SIZES in shared.js.
    loads              From HAUL_LOADS in shared.js.
    equipment          From EQUIPMENT in shared.js.
    insuranceInDays    When the insurance runs out, counted in days from
                       today. A real carrier gives a date; the samples use a
                       count so they don't all lapse as the calendar moves.
                       Below zero means it has already lapsed, and a lapsed
                       carrier is hidden from buyers automatically.
    completedDeliveries  How many PlantHub deliveries they have finished.
*/

const CARRIERS = [
  {
    id: "carrier-01",
    name: "Sample Carrier 01 (Flatbed)",
    city: "West Palm Beach", state: "FL",
    ratePerMile: 4.25, tripMinimum: 175,
    plantTypes: ["Palms", "Trees"],
    sizes: ["45G to 100G", "Boxed", "Field grown"],
    loads: ["Partial loads", "Full truckloads"],
    equipment: ["Flatbed", "Forklift on board"],
    insuranceInDays: 240, completedDeliveries: 132
  },
  {
    id: "carrier-02",
    name: "Sample Carrier 02 (Box Truck)",
    city: "Loxahatchee", state: "FL",
    ratePerMile: 2.75, tripMinimum: 95,
    plantTypes: ["Shrubs", "Groundcover and liners"],
    sizes: ["Up to 15G"],
    loads: ["Partial loads"],
    equipment: ["Box truck", "Liftgate"],
    insuranceInDays: 150, completedDeliveries: 318
  },
  {
    id: "carrier-03",
    name: "Sample Carrier 03 (Crane)",
    city: "Jupiter", state: "FL",
    ratePerMile: 6.5, tripMinimum: 350,
    plantTypes: ["Palms", "Trees"],
    sizes: ["Boxed", "Field grown"],
    loads: ["Partial loads", "Full truckloads"],
    equipment: ["Crane truck", "Flatbed"],
    insuranceInDays: 310, completedDeliveries: 74
  },
  {
    // Insurance runs out soon: still shown to buyers, flagged to its owner.
    id: "carrier-04",
    name: "Sample Carrier 04 (Enclosed Trailer)",
    city: "Delray Beach", state: "FL",
    ratePerMile: 3.1, tripMinimum: 120,
    plantTypes: ["Palms", "Shrubs", "Groundcover and liners"],
    sizes: ["Up to 15G", "45G to 100G"],
    loads: ["Partial loads"],
    equipment: ["Enclosed trailer", "Liftgate"],
    insuranceInDays: 18, completedDeliveries: 201
  },
  {
    id: "carrier-05",
    name: "Sample Carrier 05 (Gooseneck)",
    city: "Okeechobee", state: "FL",
    ratePerMile: 3.6, tripMinimum: 150,
    plantTypes: ["Palms", "Trees", "Shrubs"],
    sizes: ["Up to 15G", "45G to 100G", "Field grown"],
    loads: ["Full truckloads"],
    equipment: ["Gooseneck trailer", "Forklift on board"],
    insuranceInDays: 95, completedDeliveries: 56
  },
  {
    // Insurance already lapsed: never offered to a buyer until renewed.
    id: "carrier-06",
    name: "Sample Carrier 06 (Flatbed)",
    city: "Homestead", state: "FL",
    ratePerMile: 3.95, tripMinimum: 160,
    plantTypes: ["Palms", "Trees"],
    sizes: ["45G to 100G", "Boxed", "Field grown"],
    loads: ["Full truckloads"],
    equipment: ["Flatbed"],
    insuranceInDays: -21, completedDeliveries: 88
  },
  {
    id: "carrier-07",
    name: "Sample Carrier 07 (Box Truck)",
    city: "Boca Raton", state: "FL",
    ratePerMile: 2.95, tripMinimum: 110,
    plantTypes: ["Shrubs", "Groundcover and liners"],
    sizes: ["Up to 15G"],
    loads: ["Partial loads"],
    equipment: ["Box truck"],
    insuranceInDays: 200, completedDeliveries: 147
  },
  {
    id: "carrier-08",
    name: "Sample Carrier 08 (Tractor Trailer)",
    city: "Belle Glade", state: "FL",
    ratePerMile: 5.1, tripMinimum: 300,
    plantTypes: ["Palms", "Trees", "Shrubs"],
    sizes: ["Up to 15G", "45G to 100G", "Boxed", "Field grown"],
    loads: ["Full truckloads"],
    equipment: ["Tractor trailer", "Forklift on board"],
    insuranceInDays: 365, completedDeliveries: 39
  }
];
