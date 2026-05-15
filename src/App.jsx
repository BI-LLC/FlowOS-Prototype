import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FACILITIES, FACILITY_NAMES, getFacility } from './data/facilities'
import {
  spawnAutonomous,
  spawnForklifts,
  spawnTrucks,
  spawnHumans,
  stepAutonomous,
  stepDrifter,
  updateProximity,
  placeAutonomous,
} from './lib/simulation'
import Sidebar from './components/Sidebar'
import FacilityMap from './components/FacilityMap'
import InsightsBar from './components/InsightsBar'

export default function App() {
  // ── Facility selection ──────────────────────────────────────────────────
  const [facilityName, setFacilityName] = useState('Facility A')
  const facility = useMemo(() => getFacility(facilityName), [facilityName])

  // ── World state ─────────────────────────────────────────────────────────
  const [autonomous, setAutonomous] = useState(() => spawnAutonomous().map(placeAutonomous))
  const [nonAutonomous, setNonAutonomous] = useState(() => spawnForklifts())
  const [humans, setHumans] = useState(() => spawnHumans())
  const [selectedId, setSelectedId] = useState(null)
  const [activeInsight, setActiveInsight] = useState(null)
  const [latency, setLatency] = useState(5.2)
  const [now, setNow] = useState(new Date())

  // Re-spawn on facility change. Decatur switches to truck-based campus view.
  const switchFacility = useCallback((name) => {
    setFacilityName(name)
    setSelectedId(null)
    setActiveInsight(null)
    if (name === 'Decatur Bird Eye View') {
      // Campus view: shuttles act as the "autonomous" layer; trucks replace forklifts.
      const facility = FACILITIES[name]
      const shuttles = facility.campusRobots.map((r, i) => ({
        id: r.id,
        name: r.name,
        vendor: 'VerticalAI',
        model: `Shuttle-${String(i + 1).padStart(2, '0')}`,
        application: 'Inter-Facility Transport',
        type: 'AMR',
        category: 'autonomous',
        path: r.path,
        currentSegment: 0,
        segmentProgress: (i * 0.25) % 1,
        baseSpeed: 0.05,
        speed: 0.05,
        battery: 65 + ((i * 7) % 30),
        payload: 200 + ((i * 113) % 800),
        maxPayload: 1500,
        task: 'Campus shuttle route',
        status: 'active',
        color: '#0173F1',
        proximity: 0,
        x: r.path[0].x,
        y: r.path[0].y,
      }))
      setAutonomous(shuttles)
      setNonAutonomous(spawnTrucks())
      setHumans([])
    } else {
      setAutonomous(spawnAutonomous().map(placeAutonomous))
      setNonAutonomous(spawnForklifts())
      setHumans(spawnHumans())
    }
  }, [])

  // ── Animation loop: drive position updates ──────────────────────────────
  const lastTick = useRef(performance.now())
  const humansRef = useRef(humans)
  useEffect(() => {
    humansRef.current = humans
  }, [humans])

  useEffect(() => {
    let raf
    const tick = (t) => {
      const dt = Math.min((t - lastTick.current) / 1000, 0.1)
      lastTick.current = t

      setAutonomous((prev) => {
        const stepped = prev.map((r) => stepAutonomous(r, dt)).map((r) => {
          // ensure x/y mirror the segment progression for click-hit and rendering
          if (r.path && r.currentSegment !== undefined) {
            const a = r.path[r.currentSegment]
            const b = r.path[(r.currentSegment + 1) % r.path.length]
            return { ...r, x: a.x + (b.x - a.x) * r.segmentProgress, y: a.y + (b.y - a.y) * r.segmentProgress }
          }
          return r
        })
        return updateProximity(stepped, humansRef.current)
      })

      setNonAutonomous((prev) => prev.map((a) => stepDrifter(a, dt)))
      setHumans((prev) => prev.map((a) => stepDrifter(a, dt)))

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Clock + latency jitter
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date())
      // gentle latency oscillation — stays in healthy "good" zone
      setLatency((l) => {
        const next = l + (Math.random() - 0.5) * 1.5
        return Math.max(2, Math.min(12, next))
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const toggleSpaghetti = useCallback((id) => {
    setNonAutonomous((prev) => prev.map((a) => (a.id === id ? { ...a, showSpaghetti: !a.showSpaghetti } : a)))
  }, [])

  return (
    <div className="app-shell">
      <Sidebar
        autonomous={autonomous}
        nonAutonomous={nonAutonomous}
        humans={humans}
        selectedId={selectedId}
        onSelect={setSelectedId}
        latency={latency}
        onToggleSpaghetti={toggleSpaghetti}
      />

      <div className="right-panel">
        <FacilityMap
          autonomous={autonomous}
          nonAutonomous={nonAutonomous}
          humans={humans}
          selectedId={selectedId}
          onSelect={setSelectedId}
          insightOverlay={activeInsight}
          selectedPoint={null}
          onPointSelect={() => {}}
          facility={facility}
        />

        <div className="top-bar">
          <select
            className="facility-dropdown"
            value={facilityName}
            onChange={(e) => switchFacility(e.target.value)}
          >
            {FACILITY_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--blue)' }} />
              Autonomous
            </div>
            <div className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--silver)' }} />
              {facility.isCampus ? 'Truck' : 'Forklift'}
            </div>
            {!facility.isCampus && (
              <div className="legend-item">
                <span className="legend-swatch circle" style={{ background: 'var(--coral)' }} />
                Worker
              </div>
            )}
            <div className="legend-item">
              <span
                className="legend-swatch"
                style={{
                  background: 'rgba(217, 100, 95, 0.15)',
                  border: '1px solid rgba(217, 100, 95, 0.35)',
                }}
              />
              Forbidden
            </div>
          </div>
        </div>

        <div className="map-timestamp">
          {now.toLocaleTimeString()} · LIVE
        </div>

        <div className="pan-hint">Hold Space + drag to pan · Scroll to zoom</div>

        <InsightsBar activeInsight={activeInsight} setActiveInsight={setActiveInsight} />
      </div>
    </div>
  )
}
