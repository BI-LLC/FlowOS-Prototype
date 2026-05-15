// Facility blueprints — zones, walls, forbidden areas
// Extracted from the original OmniFlow source and preserved unchanged.
// Coordinates are normalized 0–1; each facility shares the same coordinate space
// so robots and paths can move between layouts cleanly.

const FACILITY_A = {
  name: 'Facility A',
  zones: [
    { id: 'pallets', label: 'Pallets', x: 0.01, y: 0.55, w: 0.1, h: 0.44, color: '#1A2540' },
    { id: 'receiving', label: 'Receiving', x: 0.01, y: 0.01, w: 0.1, h: 0.52, color: '#1A2540' },
    { id: 'rollmill', label: 'Roll Mill 1', x: 0.13, y: 0.01, w: 0.12, h: 0.25, color: '#1A2540' },
    { id: 'rollmill2', label: 'Roll Mill 2', x: 0.13, y: 0.28, w: 0.12, h: 0.25, color: '#1A2540' },
    { id: 'welding', label: 'Welding Cell', x: 0.13, y: 0.55, w: 0.12, h: 0.22, color: '#1A2540' },
    { id: 'compressor', label: 'Compressor Room', x: 0.13, y: 0.79, w: 0.12, h: 0.2, color: '#162038', forbidden: true },
    { id: 'lineA', label: 'Line A', x: 0.27, y: 0.6, w: 0.28, h: 0.12, color: '#1A2540' },
    { id: 'lineB', label: 'Line B-C', x: 0.27, y: 0.4, w: 0.28, h: 0.18, color: '#1A2540' },
    { id: 'lineD', label: 'Line D-E', x: 0.27, y: 0.2, w: 0.28, h: 0.18, color: '#1A2540' },
    { id: 'lineF', label: 'Line F-H', x: 0.27, y: 0.01, w: 0.28, h: 0.17, color: '#1A2540' },
    { id: 'offices', label: 'Shop Offices', x: 0.27, y: 0.79, w: 0.16, h: 0.2, color: '#162038', forbidden: true },
    { id: 'shipping1', label: 'Shipping Crates', x: 0.45, y: 0.79, w: 0.12, h: 0.2, color: '#1A2540' },
    { id: 'rollmillg', label: 'Roll Mill Grp', x: 0.57, y: 0.01, w: 0.12, h: 0.3, color: '#1A2540' },
    { id: 'finished', label: 'Finished Goods', x: 0.57, y: 0.33, w: 0.12, h: 0.2, color: '#1A2540' },
    { id: 'dtj1', label: 'DTJ Area', x: 0.57, y: 0.55, w: 0.18, h: 0.44, color: '#1A2540' },
    { id: 'shipping2', label: 'Shipping Crates', x: 0.77, y: 0.01, w: 0.12, h: 0.18, color: '#1A2540' },
    { id: 'racking', label: 'Racking', x: 0.77, y: 0.21, w: 0.12, h: 0.22, color: '#1A2540' },
    { id: 'workbench', label: 'Work Bench', x: 0.77, y: 0.45, w: 0.12, h: 0.15, color: '#1A2540' },
    { id: 'dtj2', label: 'DTJ Area 2', x: 0.77, y: 0.62, w: 0.12, h: 0.37, color: '#1A2540' },
    { id: 'oldoffice', label: 'Old Offices', x: 0.91, y: 0.6, w: 0.08, h: 0.39, color: '#162038', forbidden: true },
    { id: 'control', label: 'Control Room', x: 0.91, y: 0.01, w: 0.08, h: 0.2, color: '#162038', forbidden: true },
  ],
  walls: [
    [0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0],
    [0.12, 0, 0.12, 1], [0.26, 0, 0.26, 0.78], [0.26, 0.78, 0.26, 1],
    [0, 0.54, 0.12, 0.54], [0.12, 0.27, 0.26, 0.27], [0.12, 0.54, 0.26, 0.54],
    [0.12, 0.78, 0.26, 0.78], [0.26, 0.19, 0.56, 0.19], [0.26, 0.39, 0.56, 0.39],
    [0.26, 0.59, 0.56, 0.59], [0.26, 0.73, 0.56, 0.73], [0.26, 0.78, 0.58, 0.78],
    [0.56, 0, 0.56, 0.78], [0.44, 0.78, 0.44, 1], [0.7, 0, 0.7, 0.54],
    [0.76, 0.55, 0.76, 1], [0.76, 0, 0.76, 0.54], [0.56, 0.32, 0.7, 0.32],
    [0.56, 0.54, 0.76, 0.54], [0.76, 0.2, 0.9, 0.2], [0.76, 0.44, 0.9, 0.44],
    [0.76, 0.61, 0.9, 0.61], [0.9, 0, 0.9, 1], [0.9, 0.22, 1, 0.22],
    [0.9, 0.59, 1, 0.59], [0.34, 0.19, 0.34, 0.39], [0.42, 0.19, 0.42, 0.39],
    [0.34, 0.39, 0.34, 0.59], [0.42, 0.39, 0.42, 0.59], [0.5, 0.19, 0.5, 0.59],
  ],
  forbiddenZones: [
    { x: 0.13, y: 0.79, w: 0.12, h: 0.2 }, { x: 0.27, y: 0.79, w: 0.16, h: 0.2 },
    { x: 0.91, y: 0.6, w: 0.08, h: 0.39 }, { x: 0.91, y: 0.01, w: 0.08, h: 0.2 },
    { x: 0.29, y: 0.22, w: 0.05, h: 0.06 }, { x: 0.36, y: 0.22, w: 0.05, h: 0.06 },
    { x: 0.43, y: 0.22, w: 0.05, h: 0.06 }, { x: 0.29, y: 0.42, w: 0.05, h: 0.06 },
    { x: 0.36, y: 0.42, w: 0.05, h: 0.06 }, { x: 0.43, y: 0.42, w: 0.05, h: 0.06 },
    { x: 0.29, y: 0.62, w: 0.24, h: 0.06 }, { x: 0.58, y: 0.02, w: 0.1, h: 0.08 },
    { x: 0.58, y: 0.12, w: 0.1, h: 0.08 },
  ],
}

const FACILITY_B = {
  name: 'Facility B',
  zones: [
    { id: 'inbound', label: 'Inbound Dock', x: 0.01, y: 0.01, w: 0.15, h: 0.3, color: '#1A2540' },
    { id: 'outbound', label: 'Outbound Dock', x: 0.01, y: 0.7, w: 0.15, h: 0.29, color: '#1A2540' },
    { id: 'staging', label: 'Staging Area', x: 0.01, y: 0.33, w: 0.15, h: 0.35, color: '#1A2540' },
    { id: 'aisle1', label: 'Aisle 1-3', x: 0.18, y: 0.01, w: 0.2, h: 0.98, color: '#1A2540' },
    { id: 'aisle4', label: 'Aisle 4-6', x: 0.4, y: 0.01, w: 0.2, h: 0.98, color: '#1A2540' },
    { id: 'aisle7', label: 'Aisle 7-9', x: 0.62, y: 0.01, w: 0.2, h: 0.98, color: '#1A2540' },
    { id: 'packing', label: 'Packing', x: 0.84, y: 0.01, w: 0.15, h: 0.45, color: '#1A2540' },
    { id: 'returns', label: 'Returns', x: 0.84, y: 0.48, w: 0.15, h: 0.2, color: '#1A2540' },
    { id: 'office', label: 'Office', x: 0.84, y: 0.7, w: 0.15, h: 0.29, color: '#162038', forbidden: true },
  ],
  walls: [
    [0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0],
    [0.17, 0, 0.17, 1], [0.39, 0, 0.39, 1], [0.61, 0, 0.61, 1], [0.83, 0, 0.83, 1],
    [0, 0.32, 0.17, 0.32], [0, 0.69, 0.17, 0.69],
    [0.83, 0.47, 1, 0.47], [0.83, 0.69, 1, 0.69],
    [0.22, 0.01, 0.22, 0.98], [0.28, 0.01, 0.28, 0.98], [0.34, 0.01, 0.34, 0.98],
    [0.44, 0.01, 0.44, 0.98], [0.5, 0.01, 0.5, 0.98], [0.56, 0.01, 0.56, 0.98],
    [0.66, 0.01, 0.66, 0.98], [0.72, 0.01, 0.72, 0.98], [0.78, 0.01, 0.78, 0.98],
  ],
  forbiddenZones: [
    { x: 0.84, y: 0.7, w: 0.15, h: 0.29 },
    { x: 0.22, y: 0.05, w: 0.05, h: 0.2 }, { x: 0.22, y: 0.3, w: 0.05, h: 0.2 },
    { x: 0.22, y: 0.55, w: 0.05, h: 0.2 }, { x: 0.22, y: 0.75, w: 0.05, h: 0.2 },
    { x: 0.44, y: 0.05, w: 0.05, h: 0.2 }, { x: 0.44, y: 0.3, w: 0.05, h: 0.2 },
    { x: 0.44, y: 0.55, w: 0.05, h: 0.2 }, { x: 0.44, y: 0.75, w: 0.05, h: 0.2 },
    { x: 0.66, y: 0.05, w: 0.05, h: 0.2 }, { x: 0.66, y: 0.3, w: 0.05, h: 0.2 },
    { x: 0.66, y: 0.55, w: 0.05, h: 0.2 }, { x: 0.66, y: 0.75, w: 0.05, h: 0.2 },
  ],
}

const FACILITY_C = {
  name: 'Facility C',
  zones: [
    { id: 'bodyshop', label: 'Body Shop', x: 0.01, y: 0.01, w: 0.24, h: 0.48, color: '#1A2540' },
    { id: 'paint', label: 'Paint Shop', x: 0.01, y: 0.52, w: 0.24, h: 0.47, color: '#1A2540' },
    { id: 'trim1', label: 'Trim Line 1', x: 0.27, y: 0.01, w: 0.35, h: 0.22, color: '#1A2540' },
    { id: 'trim2', label: 'Trim Line 2', x: 0.27, y: 0.25, w: 0.35, h: 0.22, color: '#1A2540' },
    { id: 'chassis', label: 'Chassis Line', x: 0.27, y: 0.49, w: 0.35, h: 0.22, color: '#1A2540' },
    { id: 'final', label: 'Final Assembly', x: 0.27, y: 0.73, w: 0.35, h: 0.26, color: '#1A2540' },
    { id: 'engine', label: 'Engine Dress', x: 0.64, y: 0.01, w: 0.18, h: 0.35, color: '#1A2540' },
    { id: 'subassy', label: 'Sub-Assembly', x: 0.64, y: 0.38, w: 0.18, h: 0.3, color: '#1A2540' },
    { id: 'qc', label: 'Quality Check', x: 0.64, y: 0.7, w: 0.18, h: 0.29, color: '#1A2540' },
    { id: 'hazmat', label: 'Hazmat Storage', x: 0.84, y: 0.01, w: 0.15, h: 0.25, color: '#162038', forbidden: true },
    { id: 'eol', label: 'End of Line', x: 0.84, y: 0.28, w: 0.15, h: 0.35, color: '#1A2540' },
    { id: 'shipping', label: 'Vehicle Yard', x: 0.84, y: 0.65, w: 0.15, h: 0.34, color: '#1A2540' },
  ],
  walls: [
    [0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0],
    [0.26, 0, 0.26, 1], [0.63, 0, 0.63, 1], [0.83, 0, 0.83, 1],
    [0, 0.5, 0.26, 0.5], [0.26, 0.24, 0.63, 0.24], [0.26, 0.48, 0.63, 0.48],
    [0.26, 0.72, 0.63, 0.72], [0.63, 0.37, 0.83, 0.37], [0.63, 0.69, 0.83, 0.69],
    [0.83, 0.27, 1, 0.27], [0.83, 0.64, 1, 0.64],
  ],
  forbiddenZones: [
    { x: 0.84, y: 0.01, w: 0.15, h: 0.25 },
    { x: 0.03, y: 0.1, w: 0.08, h: 0.12 }, { x: 0.14, y: 0.1, w: 0.08, h: 0.12 },
    { x: 0.03, y: 0.6, w: 0.08, h: 0.1 }, { x: 0.14, y: 0.6, w: 0.08, h: 0.1 },
  ],
}

const FACILITY_D = {
  name: 'Facility D',
  zones: [
    { id: 'rawrecv', label: 'Raw Receiving', x: 0.01, y: 0.01, w: 0.18, h: 0.3, color: '#1A2540' },
    { id: 'coldstore', label: 'Cold Storage', x: 0.01, y: 0.33, w: 0.18, h: 0.33, color: '#1C2540' },
    { id: 'waste', label: 'Waste Processing', x: 0.01, y: 0.68, w: 0.18, h: 0.31, color: '#1A2540' },
    { id: 'prep', label: 'Prep Area', x: 0.21, y: 0.01, w: 0.25, h: 0.48, color: '#1A2540' },
    { id: 'cooking', label: 'Cooking/Processing', x: 0.21, y: 0.51, w: 0.25, h: 0.48, color: '#1A2540' },
    { id: 'pack1', label: 'Packaging Line 1', x: 0.48, y: 0.01, w: 0.25, h: 0.3, color: '#1A2540' },
    { id: 'pack2', label: 'Packaging Line 2', x: 0.48, y: 0.33, w: 0.25, h: 0.3, color: '#1A2540' },
    { id: 'labeling', label: 'Labeling', x: 0.48, y: 0.65, w: 0.25, h: 0.34, color: '#1A2540' },
    { id: 'freezer', label: 'Blast Freezer', x: 0.75, y: 0.01, w: 0.12, h: 0.48, color: '#162038', forbidden: true },
    { id: 'dispatch', label: 'Dispatch Bay', x: 0.75, y: 0.51, w: 0.24, h: 0.48, color: '#1A2540' },
    { id: 'lab', label: 'QA Laboratory', x: 0.89, y: 0.01, w: 0.1, h: 0.25, color: '#162038', forbidden: true },
    { id: 'maint', label: 'Maintenance', x: 0.89, y: 0.28, w: 0.1, h: 0.21, color: '#1A2540' },
  ],
  walls: [
    [0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0],
    [0.2, 0, 0.2, 1], [0.47, 0, 0.47, 1], [0.74, 0, 0.74, 1], [0.88, 0, 0.88, 0.5],
    [0, 0.32, 0.2, 0.32], [0, 0.67, 0.2, 0.67],
    [0.2, 0.5, 0.47, 0.5], [0.47, 0.32, 0.74, 0.32], [0.47, 0.64, 0.74, 0.64],
    [0.74, 0.5, 1, 0.5], [0.88, 0.27, 1, 0.27],
  ],
  forbiddenZones: [
    { x: 0.75, y: 0.01, w: 0.12, h: 0.48 }, { x: 0.89, y: 0.01, w: 0.1, h: 0.25 },
    { x: 0.25, y: 0.1, w: 0.06, h: 0.1 }, { x: 0.35, y: 0.1, w: 0.06, h: 0.1 },
    { x: 0.25, y: 0.6, w: 0.06, h: 0.1 }, { x: 0.35, y: 0.6, w: 0.06, h: 0.1 },
  ],
}

const FACILITY_E = {
  name: 'Facility E',
  zones: [
    { id: 'smt1', label: 'SMT Line 1', x: 0.01, y: 0.01, w: 0.3, h: 0.22, color: '#1A2540' },
    { id: 'smt2', label: 'SMT Line 2', x: 0.01, y: 0.25, w: 0.3, h: 0.22, color: '#1A2540' },
    { id: 'thruhole', label: 'Through-Hole', x: 0.01, y: 0.49, w: 0.3, h: 0.22, color: '#1A2540' },
    { id: 'testing', label: 'Test & Burn-In', x: 0.01, y: 0.73, w: 0.3, h: 0.26, color: '#1A2540' },
    { id: 'cleanroom', label: 'Cleanroom', x: 0.33, y: 0.01, w: 0.22, h: 0.48, color: '#162038', forbidden: true },
    { id: 'assy', label: 'Final Assembly', x: 0.33, y: 0.51, w: 0.22, h: 0.48, color: '#1A2540' },
    { id: 'conformal', label: 'Conformal Coat', x: 0.57, y: 0.01, w: 0.18, h: 0.3, color: '#1A2540' },
    { id: 'xray', label: 'X-Ray / AOI', x: 0.57, y: 0.33, w: 0.18, h: 0.3, color: '#1A2540' },
    { id: 'boxbuild', label: 'Box Build', x: 0.57, y: 0.65, w: 0.18, h: 0.34, color: '#1A2540' },
    { id: 'esd', label: 'ESD Storage', x: 0.77, y: 0.01, w: 0.1, h: 0.48, color: '#1A2540' },
    { id: 'shipping', label: 'Shipping', x: 0.77, y: 0.51, w: 0.22, h: 0.24, color: '#1A2540' },
    { id: 'server', label: 'Server Room', x: 0.89, y: 0.01, w: 0.1, h: 0.25, color: '#162038', forbidden: true },
    { id: 'office', label: 'Engineering', x: 0.77, y: 0.77, w: 0.22, h: 0.22, color: '#162038', forbidden: true },
  ],
  walls: [
    [0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0],
    [0.32, 0, 0.32, 1], [0.56, 0, 0.56, 1], [0.76, 0, 0.76, 1], [0.88, 0, 0.88, 0.5],
    [0, 0.24, 0.32, 0.24], [0, 0.48, 0.32, 0.48], [0, 0.72, 0.32, 0.72],
    [0.32, 0.5, 0.56, 0.5], [0.56, 0.32, 0.76, 0.32], [0.56, 0.64, 0.76, 0.64],
    [0.76, 0.5, 1, 0.5], [0.76, 0.76, 1, 0.76],
  ],
  forbiddenZones: [
    { x: 0.33, y: 0.01, w: 0.22, h: 0.48 }, { x: 0.89, y: 0.01, w: 0.1, h: 0.25 },
    { x: 0.77, y: 0.77, w: 0.22, h: 0.22 },
    { x: 0.35, y: 0.1, w: 0.08, h: 0.12 }, { x: 0.45, y: 0.1, w: 0.08, h: 0.12 },
    { x: 0.35, y: 0.28, w: 0.08, h: 0.12 }, { x: 0.45, y: 0.28, w: 0.08, h: 0.12 },
  ],
}

const DECATUR_CAMPUS = {
  name: 'Decatur Bird Eye View',
  isCampus: true,
  facilities: [
    { id: 'fac_a', label: 'Facility A', x: 0.05, y: 0.08, w: 0.22, h: 0.35 },
    { id: 'fac_b', label: 'Facility B', x: 0.35, y: 0.03, w: 0.25, h: 0.28 },
    { id: 'fac_c', label: 'Facility C', x: 0.68, y: 0.1, w: 0.2, h: 0.3 },
    { id: 'fac_d', label: 'Facility D', x: 0.12, y: 0.58, w: 0.24, h: 0.34 },
    { id: 'fac_e', label: 'Facility E', x: 0.55, y: 0.55, w: 0.28, h: 0.38 },
  ],
  campusRobots: [
    { id: 'cr1', name: 'Shuttle-01', path: [{ x: 0.16, y: 0.43 }, { x: 0.47, y: 0.31 }, { x: 0.78, y: 0.25 }, { x: 0.47, y: 0.31 }] },
    { id: 'cr2', name: 'Shuttle-02', path: [{ x: 0.27, y: 0.26 }, { x: 0.47, y: 0.17 }, { x: 0.68, y: 0.25 }, { x: 0.47, y: 0.45 }] },
    { id: 'cr3', name: 'Shuttle-03', path: [{ x: 0.24, y: 0.75 }, { x: 0.45, y: 0.5 }, { x: 0.69, y: 0.55 }, { x: 0.45, y: 0.5 }] },
    { id: 'cr4', name: 'Shuttle-04', path: [{ x: 0.16, y: 0.43 }, { x: 0.24, y: 0.58 }, { x: 0.55, y: 0.74 }, { x: 0.83, y: 0.55 }] },
    { id: 'cr5', name: 'Shuttle-05', path: [{ x: 0.78, y: 0.4 }, { x: 0.69, y: 0.55 }, { x: 0.36, y: 0.58 }, { x: 0.16, y: 0.43 }] },
    { id: 'cr6', name: 'Shuttle-06', path: [{ x: 0.6, y: 0.31 }, { x: 0.55, y: 0.55 }, { x: 0.36, y: 0.75 }, { x: 0.24, y: 0.58 }] },
  ],
  zones: [],
  walls: [],
  forbiddenZones: [],
}

export const FACILITIES = {
  'Facility A': FACILITY_A,
  'Facility B': FACILITY_B,
  'Facility C': FACILITY_C,
  'Facility D': FACILITY_D,
  'Facility E': FACILITY_E,
  'Decatur Bird Eye View': DECATUR_CAMPUS,
}

export const FACILITY_NAMES = Object.keys(FACILITIES)

export function getFacility(name) {
  return FACILITIES[name] || FACILITY_A
}
