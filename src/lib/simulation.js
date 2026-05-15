// Simulation engine — robot movement along closed paths, forklift wandering,
// human drift, congestion detection, and trail generation for the spaghetti map.

import {
  ROBOT_FLEET,
  ROBOT_PATHS,
  HUMAN_SPAWN_ZONES,
  HUMAN_NAMES,
  FORKLIFT_TASKS,
  FORKLIFT_TRIPS,
  FORKLIFT_REGIONS,
  TRUCK_NAMES,
  TRUCK_TASKS,
  TRUCK_TRIPS,
  TRUCK_REGIONS,
} from '../data/fleet'

// Brand-aligned palette — see /src/App.css for full token list.
// Autonomous robots use VerticalAI blue; non-autonomous and humans use
// secondary tokens so the eye can scan asset categories at a glance.
const COLOR_AUTONOMOUS = '#0173F1'
const COLOR_NON_AUTONOMOUS = '#94A3B8'
const COLOR_HUMAN = '#D9645F'

const PROXIMITY_THRESHOLD = 0.05
let assetCounter = 0
let statusCounter = 0

function rand(a, b) {
  return a + Math.random() * (b - a)
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function isInsideForbidden(x, y, forbiddenZones) {
  for (const z of forbiddenZones) {
    if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) return true
  }
  return false
}

function nextStatus() {
  const i = statusCounter++
  if (i === 2 || i === 7) return 'charging'
  if (i === 5) return 'maintenance'
  return 'active'
}

// ─── Autonomous robots ──────────────────────────────────────────────────────
export function spawnAutonomous() {
  statusCounter = 0
  const robots = []
  for (let t = 0; t < ROBOT_FLEET.length; t++) {
    const def = ROBOT_FLEET[t]
    const path = ROBOT_PATHS[def.pathIdx]
    const seg = t % path.length
    const prog = (t * 0.3) % 1
    const status = nextStatus()
    robots.push({
      id: `auto-${assetCounter++}`,
      name: `${def.model}-${String(t + 1).padStart(2, '0')}`,
      vendor: def.vendor,
      model: def.model,
      application: def.application,
      type: def.type,
      category: 'autonomous',
      path,
      currentSegment: seg,
      segmentProgress: status === 'active' ? prog : 0,
      baseSpeed: rand(0.15, 0.35),
      speed: status === 'active' ? rand(0.15, 0.35) : 0,
      battery: Math.round(status === 'charging' ? rand(5, 40) : rand(15, 100)),
      payload: Math.round(rand(0, 500)),
      maxPayload: Math.round(rand(500, 1500)),
      task: def.application,
      status,
      color: COLOR_AUTONOMOUS,
      proximity: 0,
    })
  }
  return robots
}

// ─── Forklifts (non-autonomous, in-facility) ────────────────────────────────
function buildTrail(x, y, cfg) {
  const { mainTrips, detours, spread } = cfg
  const points = []
  const dx = Math.max(0.05, Math.min(0.9, x + (Math.random() - 0.5) * spread))
  const dy = Math.max(0.05, Math.min(0.9, y + (Math.random() - 0.5) * spread))

  for (let n = 0; n < mainTrips; n++) {
    const forward = n % 2 === 0
    const sx = forward ? x : dx
    const sy = forward ? y : dy
    const ex = forward ? dx : x
    const ey = forward ? dy : y
    const steps = 25 + Math.floor(Math.random() * 15)
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const px = sx + (ex - sx) * t + (Math.random() - 0.5) * 0.015
      const py = sy + (ey - sy) * t + (Math.random() - 0.5) * 0.015
      points.push({ x: px, y: py })
    }
  }
  // detours = noisy wander loops
  for (let n = 0; n < detours; n++) {
    const cx = rand(0.1, 0.85)
    const cy = rand(0.1, 0.85)
    const r = rand(0.04, 0.1)
    const segs = 12 + Math.floor(Math.random() * 8)
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2
      points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
    }
  }
  return points
}

export function spawnForklifts() {
  const trucks = []
  const models = ['FC 5200', 'GLP050', 'H50FT', 'SC 6000']
  for (let i = 0; i < FORKLIFT_TASKS.length; i++) {
    const region = FORKLIFT_REGIONS[i % FORKLIFT_REGIONS.length]
    const x = region.x + Math.random() * region.w
    const y = region.y + Math.random() * region.h
    const targetX = Math.max(0.02, Math.min(0.98, x + (Math.random() - 0.5) * 0.4))
    const targetY = Math.max(0.02, Math.min(0.98, y + (Math.random() - 0.5) * 0.4))
    const trail = buildTrail(x, y, FORKLIFT_TRIPS[i])
    trucks.push({
      id: `fork-${assetCounter++}`,
      name: `Forklift-${String(i + 1).padStart(2, '0')}`,
      vendor: 'Fleet',
      model: pick(models),
      type: 'Forklift',
      category: 'non-autonomous',
      task: FORKLIFT_TASKS[i],
      x,
      y,
      targetX,
      targetY,
      speed: rand(0.04, 0.1),
      status: 'active',
      color: COLOR_NON_AUTONOMOUS,
      trail,
      showSpaghetti: false,
    })
  }
  return trucks
}

// ─── Trucks (campus-level only) ─────────────────────────────────────────────
export function spawnTrucks() {
  const trucks = []
  for (let i = 0; i < TRUCK_NAMES.length; i++) {
    const region = TRUCK_REGIONS[i % TRUCK_REGIONS.length]
    const x = region.x + Math.random() * region.w
    const y = region.y + Math.random() * region.h
    const tx = Math.max(0.02, Math.min(0.98, x + (Math.random() - 0.5) * 0.4))
    const ty = Math.max(0.02, Math.min(0.98, y + (Math.random() - 0.5) * 0.4))
    const trail = buildTrail(x, y, TRUCK_TRIPS[i])
    trucks.push({
      id: `truck-${assetCounter++}`,
      name: TRUCK_NAMES[i],
      vendor: 'Fleet',
      model: `T-${800 + i}`,
      type: 'Truck',
      category: 'non-autonomous',
      task: TRUCK_TASKS[i],
      x,
      y,
      targetX: tx,
      targetY: ty,
      speed: rand(0.05, 0.12),
      status: 'active',
      color: COLOR_NON_AUTONOMOUS,
      trail,
      showSpaghetti: false,
    })
  }
  return trucks
}

// ─── Humans ─────────────────────────────────────────────────────────────────
export function spawnHumans() {
  const humans = []
  for (let i = 0; i < HUMAN_NAMES.length; i++) {
    let spot = null
    for (let tries = 0; tries < 50; tries++) {
      const zone = pick(HUMAN_SPAWN_ZONES)
      const x = zone.x + Math.random() * zone.w
      const y = zone.y + Math.random() * zone.h
      spot = { x, y }
      break
    }
    humans.push({
      id: `human-${assetCounter++}`,
      name: HUMAN_NAMES[i],
      category: 'human',
      x: spot.x,
      y: spot.y,
      targetX: spot.x + (Math.random() - 0.5) * 0.15,
      targetY: spot.y + (Math.random() - 0.5) * 0.15,
      speed: rand(0.02, 0.06),
      color: COLOR_HUMAN,
    })
  }
  return humans
}

// ─── Step functions ─────────────────────────────────────────────────────────
export function stepAutonomous(robot, dt) {
  if (robot.status !== 'active') return robot
  const path = robot.path
  const seg = robot.currentSegment
  const a = path[seg]
  const b = path[(seg + 1) % path.length]
  const segLen = Math.hypot(b.x - a.x, b.y - a.y)
  const advance = (robot.speed * dt) / Math.max(segLen, 0.0001)
  let prog = robot.segmentProgress + advance
  let nextSeg = seg
  if (prog >= 1) {
    prog -= 1
    nextSeg = (seg + 1) % path.length
  }
  const c = path[nextSeg]
  const d = path[(nextSeg + 1) % path.length]
  return {
    ...robot,
    currentSegment: nextSeg,
    segmentProgress: prog,
    x: c.x + (d.x - c.x) * prog,
    y: c.y + (d.y - c.y) * prog,
  }
}

export function stepDrifter(asset, dt, bounds = 0.02) {
  // Generic drift toward target; pick a new target when close
  const dx = asset.targetX - asset.x
  const dy = asset.targetY - asset.y
  const dist = Math.hypot(dx, dy)
  if (dist < 0.015) {
    const tx = Math.max(bounds, Math.min(1 - bounds, asset.x + (Math.random() - 0.5) * 0.3))
    const ty = Math.max(bounds, Math.min(1 - bounds, asset.y + (Math.random() - 0.5) * 0.3))
    return { ...asset, targetX: tx, targetY: ty }
  }
  const step = asset.speed * dt
  return {
    ...asset,
    x: asset.x + (dx / dist) * step,
    y: asset.y + (dy / dist) * step,
  }
}

export function updateProximity(robots, humans) {
  return robots.map((r, i) => {
    let minDist = Infinity
    for (let j = 0; j < robots.length; j++) {
      if (i === j) continue
      const d = Math.hypot(r.x - robots[j].x, r.y - robots[j].y)
      if (d < minDist) minDist = d
    }
    for (const h of humans) {
      const d = Math.hypot(r.x - h.x, r.y - h.y)
      if (d < minDist) minDist = d
    }
    const proximity = minDist < PROXIMITY_THRESHOLD ? 1 - minDist / PROXIMITY_THRESHOLD : 0
    return { ...r, proximity }
  })
}

// Compute initial (x,y) for an autonomous robot so its rendering starts in
// the right place before the first animation tick lands.
export function placeAutonomous(robot) {
  const a = robot.path[robot.currentSegment]
  const b = robot.path[(robot.currentSegment + 1) % robot.path.length]
  return {
    ...robot,
    x: a.x + (b.x - a.x) * robot.segmentProgress,
    y: a.y + (b.y - a.y) * robot.segmentProgress,
  }
}
