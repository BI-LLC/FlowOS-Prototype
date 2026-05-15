// Fleet and personnel definitions extracted from the original OmniFlow source.
// 23 autonomous assets across 7 vendors (MiR, Gulf, OTTO, JBT, Seegrid, Oasis),
// 10 trucks for inter-facility logistics, and 20 personnel on the floor.

export const ROBOT_FLEET = [
  { vendor: 'MiR', model: 'MiR250', type: 'AMR', application: 'Transportation', pathIdx: 0 },
  { vendor: 'MiR', model: 'MiR250', type: 'AMR', application: 'Transportation', pathIdx: 0 },
  { vendor: 'MiR', model: 'MiR600', type: 'AMR', application: 'Delivery', pathIdx: 1 },
  { vendor: 'Gulf', model: 'GF-Hauler', type: 'AMR', application: 'Delivery', pathIdx: 1 },
  { vendor: 'OTTO', model: 'OTTO 100', type: 'AMR', application: 'Transportation', pathIdx: 2 },
  { vendor: 'OTTO', model: 'OTTO 100', type: 'AMR', application: 'Transportation', pathIdx: 2 },
  { vendor: 'OTTO', model: 'OTTO 1500', type: 'AGV', application: 'Heavy Hauling', pathIdx: 3 },
  { vendor: 'JBT', model: 'AGV-S100', type: 'AGV', application: 'Pallet Transport', pathIdx: 4 },
  { vendor: 'JBT', model: 'AGV-S100', type: 'AGV', application: 'Pallet Transport', pathIdx: 4 },
  { vendor: 'JBT', model: 'AGV-T200', type: 'AGV', application: 'Towing', pathIdx: 4 },
  { vendor: 'Seegrid', model: 'Palion AMR', type: 'AMR', application: 'Picking', pathIdx: 5 },
  { vendor: 'Seegrid', model: 'Palion Lift', type: 'AGV', application: 'Stacking', pathIdx: 6 },
  { vendor: 'Seegrid', model: 'Palion Lift', type: 'AGV', application: 'Stacking', pathIdx: 6 },
  { vendor: 'Oasis', model: 'OA-200', type: 'Sweeper', application: 'Sweeping', pathIdx: 7 },
  { vendor: 'Oasis', model: 'OA-400', type: 'Sweeper', application: 'Floor Cleaning', pathIdx: 8 },
  { vendor: 'Gulf', model: 'GF-Mover', type: 'Food Delivery', application: 'Food Delivery', pathIdx: 9 },
  { vendor: 'Gulf', model: 'GF-Mover', type: 'Food Delivery', application: 'Food Delivery', pathIdx: 9 },
  { vendor: 'MiR', model: 'MiR600', type: 'AMR', application: 'Transportation', pathIdx: 10 },
  { vendor: 'Gulf', model: 'GF-Hauler', type: 'AMR', application: 'Transportation', pathIdx: 11 },
  { vendor: 'OTTO', model: 'OTTO 1500', type: 'AGV', application: 'Heavy Hauling', pathIdx: 11 },
  { vendor: 'MiR', model: 'MiR250-D', type: 'Delivery', application: 'Part Delivery', pathIdx: 3 },
  { vendor: 'Gulf', model: 'GF-Express', type: 'Delivery', application: 'Tool Delivery', pathIdx: 5 },
]

// 12 path templates (closed loops) — robots cycle through these segments.
// Each path is a polygon of waypoints in normalized facility coordinates.
export const ROBOT_PATHS = [
  [{ x: 0.06, y: 0.1 }, { x: 0.06, y: 0.53 }, { x: 0.26, y: 0.53 }, { x: 0.26, y: 0.1 }],
  [{ x: 0.12, y: 0.08 }, { x: 0.12, y: 0.53 }, { x: 0.26, y: 0.53 }, { x: 0.26, y: 0.08 }],
  [{ x: 0.13, y: 0.19 }, { x: 0.55, y: 0.19 }, { x: 0.55, y: 0.39 }, { x: 0.13, y: 0.39 }],
  [{ x: 0.26, y: 0.19 }, { x: 0.56, y: 0.19 }, { x: 0.56, y: 0.53 }, { x: 0.26, y: 0.53 }],
  [{ x: 0.12, y: 0.53 }, { x: 0.56, y: 0.53 }, { x: 0.56, y: 0.19 }, { x: 0.12, y: 0.19 }],
  [{ x: 0.56, y: 0.19 }, { x: 0.76, y: 0.19 }, { x: 0.76, y: 0.53 }, { x: 0.56, y: 0.53 }],
  [{ x: 0.76, y: 0.05 }, { x: 0.76, y: 0.53 }, { x: 0.9, y: 0.53 }, { x: 0.9, y: 0.05 }],
  [{ x: 0.06, y: 0.53 }, { x: 0.06, y: 0.9 }, { x: 0.12, y: 0.9 }, { x: 0.12, y: 0.53 }],
  [{ x: 0.26, y: 0.3 }, { x: 0.56, y: 0.3 }, { x: 0.56, y: 0.39 }, { x: 0.26, y: 0.39 }],
  [{ x: 0.45, y: 0.73 }, { x: 0.56, y: 0.73 }, { x: 0.56, y: 0.53 }, { x: 0.45, y: 0.53 }],
  [{ x: 0.56, y: 0.35 }, { x: 0.7, y: 0.35 }, { x: 0.7, y: 0.19 }, { x: 0.56, y: 0.19 }],
  [{ x: 0.12, y: 0.02 }, { x: 0.9, y: 0.02 }, { x: 0.9, y: 0.53 }, { x: 0.12, y: 0.53 }],
]

// Human spawn zones (probability-weighted)
export const HUMAN_SPAWN_ZONES = [
  { x: 0.01, y: 0.01, w: 0.1, h: 0.52 },
  { x: 0.01, y: 0.55, w: 0.1, h: 0.4 },
  { x: 0.13, y: 0.01, w: 0.12, h: 0.76 },
  { x: 0.27, y: 0.01, w: 0.28, h: 0.77 },
  { x: 0.45, y: 0.79, w: 0.12, h: 0.19 },
  { x: 0.57, y: 0.01, w: 0.18, h: 0.98 },
  { x: 0.77, y: 0.01, w: 0.12, h: 0.98 },
]

// 20 worker names that drift around the floor
export const HUMAN_NAMES = [
  'James R.', 'Maria S.', 'Kenji T.', 'Priya K.', 'Carlos M.',
  'Fatima A.', 'Liam O.', 'Yuki N.', 'Olga P.', 'Ahmed B.',
  'Sophia L.', 'David W.', 'Chen X.', 'Emma J.', 'Raj V.',
  'Anna G.', 'Miguel H.', 'Lisa D.', 'Omar F.', 'Julia Z.',
]

// Forklift / non-autonomous task descriptions for in-facility view
export const FORKLIFT_TASKS = [
  'Part delivery from Cell A to Assembly',
  'Raw material transfer to Roll Mill 1',
  'Finished goods to Shipping Crates',
  'Tool changeover support — Welding Cell',
  'WIP transport Line B to Line D',
  'Pallet pickup from Receiving Dock',
  'Scrap removal from Machining',
  'Supply run to DTJ Area',
]

// Trip configuration per forklift — drives "spaghetti map" trail intensity
export const FORKLIFT_TRIPS = [
  { mainTrips: 14, detours: 3, spread: 0.65 },
  { mainTrips: 6, detours: 1, spread: 0.5 },
  { mainTrips: 25, detours: 14, spread: 0.8 },
  { mainTrips: 5, detours: 0, spread: 0.45 },
  { mainTrips: 22, detours: 12, spread: 0.75 },
  { mainTrips: 7, detours: 0, spread: 0.4 },
  { mainTrips: 20, detours: 10, spread: 0.7 },
  { mainTrips: 5, detours: 1, spread: 0.5 },
]

// Forklift spawn regions on the in-facility view
export const FORKLIFT_REGIONS = [
  { x: 0.03, y: 0.05, w: 0.08, h: 0.45 },
  { x: 0.14, y: 0.05, w: 0.1, h: 0.45 },
  { x: 0.28, y: 0.02, w: 0.12, h: 0.35 },
  { x: 0.42, y: 0.02, w: 0.12, h: 0.35 },
  { x: 0.28, y: 0.4, w: 0.12, h: 0.3 },
  { x: 0.42, y: 0.4, w: 0.14, h: 0.3 },
  { x: 0.58, y: 0.05, w: 0.16, h: 0.45 },
  { x: 0.78, y: 0.05, w: 0.1, h: 0.5 },
]

// Truck names + tasks for the campus (Decatur Bird Eye View)
export const TRUCK_NAMES = [
  'Truck Alpha', 'Truck Bravo', 'Truck Charlie', 'Truck Delta', 'Truck Echo',
  'Truck Foxtrot', 'Truck Golf', 'Truck Hotel', 'Truck India', 'Truck Juliet',
]

export const TRUCK_TASKS = [
  'Raw material delivery to Facility A',
  'Finished goods pickup from Facility B',
  'Parts transfer A to C',
  'Waste removal from Facility D',
  'Supply run to Facility E',
  'Cross-dock shipment B to D',
  'Equipment delivery to Facility C',
  'Packaging materials to Facility A',
  'Outbound shipment from Facility E',
  'Emergency parts to Facility B',
]

export const TRUCK_TRIPS = [
  { mainTrips: 10, detours: 2, spread: 0.5 },
  { mainTrips: 5, detours: 0, spread: 0.4 },
  { mainTrips: 18, detours: 8, spread: 0.7 },
  { mainTrips: 6, detours: 1, spread: 0.45 },
  { mainTrips: 15, detours: 6, spread: 0.65 },
  { mainTrips: 4, detours: 0, spread: 0.35 },
  { mainTrips: 20, detours: 10, spread: 0.75 },
  { mainTrips: 7, detours: 1, spread: 0.5 },
  { mainTrips: 12, detours: 4, spread: 0.6 },
  { mainTrips: 5, detours: 1, spread: 0.4 },
]

export const TRUCK_REGIONS = [
  { x: 0.02, y: 0.44, w: 0.3, h: 0.1 },
  { x: 0.32, y: 0.44, w: 0.3, h: 0.1 },
  { x: 0.62, y: 0.44, w: 0.3, h: 0.1 },
  { x: 0.02, y: 0.9, w: 0.4, h: 0.08 },
  { x: 0.5, y: 0.9, w: 0.4, h: 0.08 },
  { x: 0.02, y: 0.02, w: 0.96, h: 0.04 },
  { x: 0.9, y: 0.1, w: 0.08, h: 0.8 },
  { x: 0.02, y: 0.44, w: 0.2, h: 0.1 },
  { x: 0.4, y: 0.44, w: 0.2, h: 0.1 },
  { x: 0.7, y: 0.44, w: 0.2, h: 0.1 },
]

export const ASSET_TYPE_FILTERS = ['All', 'AMR', 'AGV', 'Sweeper', 'Delivery', 'Food Delivery', 'Truck']
