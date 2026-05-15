import { useEffect, useMemo, useRef, useState } from 'react'
import { ROBOT_PATHS } from '../data/fleet'

const W = 800
const H = 560

// Brand-aligned palette for light theme.
// Canvas drawing operations need raw color strings (not CSS vars), so
// the palette is duplicated here. Keep in sync with App.css.
const PALETTE = {
  bgCanvas: '#FFFFFF',        // map background
  zoneFill: '#F5F6F8',        // standard zone (subtle grey card on white)
  zoneForbidden: '#FBEEED',   // coral-50, forbidden areas
  zoneStroke: '#E2E8F0',      // line color
  zoneStrokeForbidden: 'rgba(217, 100, 95, 0.35)',
  zoneLabel: 'rgba(44, 62, 80, 0.75)',      // ink-2 — readable on light fill
  zoneLabelForbidden: 'rgba(217, 100, 95, 0.9)',
  wall: 'rgba(44, 62, 80, 0.35)',          // ink-2 walls
  blue: '#0173F1',
  blueLight: '#D9E9FF',
  blueRoute: 'rgba(1, 115, 241, 0.55)',
  blueRouteDim: 'rgba(1, 115, 241, 0.14)',
  coral: '#D9645F',
  coralFade: 'rgba(217, 100, 95, 0.45)',
  silver: '#2C3E50',          // ink-2 for forklift squares (visible on white)
  chargeStation: 'rgba(1, 115, 241, 0.06)',
  chargeStationStroke: 'rgba(1, 115, 241, 0.3)',
  chargeStationLabel: 'rgba(1, 115, 241, 0.7)',
  textMuted: 'rgba(44, 62, 80, 0.6)',
}

export default function FacilityMap({
  autonomous,
  nonAutonomous,
  humans,
  selectedId,
  onSelect,
  insightOverlay,
  selectedPoint,
  onPointSelect,
  facility,
}) {
  const canvasRef = useRef(null)
  const stateRef = useRef({ autonomous, nonAutonomous, humans, selectedId, insightOverlay, selectedPoint, facility })
  const viewRef = useRef({ panX: 0, panY: 0, zoom: 1 })
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 })
  const spaceRef = useRef(false)
  const phaseRef = useRef(0)
  const [, force] = useState(0)

  useEffect(() => {
    stateRef.current = { autonomous, nonAutonomous, humans, selectedId, insightOverlay, selectedPoint, facility }
  }, [autonomous, nonAutonomous, humans, selectedId, insightOverlay, selectedPoint, facility])

  // World → canvas pixel transformer (handles pan + zoom)
  const toPx = useMemo(
    () => (x, y) => {
      const v = viewRef.current
      return {
        x: x * W * v.zoom + v.panX,
        y: y * H * v.zoom + v.panY,
      }
    },
    [],
  )

  // ── Keyboard: hold Space to enable panning ───────────────────────────────
  useEffect(() => {
    const down = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        spaceRef.current = true
        const c = canvasRef.current
        if (c) c.style.cursor = 'grab'
      }
    }
    const up = (e) => {
      if (e.code === 'Space') {
        spaceRef.current = false
        const c = canvasRef.current
        if (c && !dragRef.current.dragging) c.style.cursor = 'crosshair'
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // ── Animation loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Hi-DPI setup: render at devicePixelRatio so text stays sharp when the
    // CSS layer stretches the canvas. Drawing code keeps using the logical
    // (W, H) coordinate space because ctx is pre-scaled.
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    let raf
    let last = performance.now()

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      phaseRef.current += dt

      const { autonomous, nonAutonomous, humans, selectedId, insightOverlay, selectedPoint, facility } =
        stateRef.current

      // background
      ctx.fillStyle = PALETTE.bgCanvas
      ctx.fillRect(0, 0, W, H)

      // ── ZONES ──────────────────────────────────────────────────────────
      if (facility.isCampus) {
        // Campus / bird-eye view — draw labeled facility rectangles
        for (const fac of facility.facilities) {
          const tl = toPx(fac.x, fac.y)
          const w = fac.w * W * viewRef.current.zoom
          const h = fac.h * H * viewRef.current.zoom
          ctx.fillStyle = PALETTE.zoneFill
          ctx.strokeStyle = PALETTE.zoneStroke
          ctx.lineWidth = 1.2
          ctx.fillRect(tl.x, tl.y, w, h)
          ctx.strokeRect(tl.x, tl.y, w, h)
          ctx.fillStyle = 'rgba(10, 25, 41, 0.75)'
          ctx.font = 'bold 11px Montserrat, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(fac.label, tl.x + w / 2, tl.y + h / 2)
        }
        // campus shuttles drawn below as autonomous
      } else {
        for (const z of facility.zones) {
          const tl = toPx(z.x, z.y)
          const w = z.w * W * viewRef.current.zoom
          const h = z.h * H * viewRef.current.zoom
          // Zone fill is theme-controlled (PALETTE) — the per-zone `color`
          // field in facilities.js is a legacy holdover from the dark theme.
          ctx.fillStyle = z.forbidden ? PALETTE.zoneForbidden : PALETTE.zoneFill
          ctx.strokeStyle = z.forbidden ? PALETTE.zoneStrokeForbidden : PALETTE.zoneStroke
          ctx.lineWidth = 0.8
          ctx.fillRect(tl.x, tl.y, w, h)
          ctx.strokeRect(tl.x, tl.y, w, h)
          ctx.fillStyle = z.forbidden ? PALETTE.zoneLabelForbidden : PALETTE.zoneLabel
          ctx.font = '600 10.5px Montserrat, sans-serif'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
          ctx.fillText(z.label, tl.x + 5, tl.y + 5)
        }
        // walls
        ctx.strokeStyle = PALETTE.wall
        ctx.lineWidth = 1.4
        for (const w of facility.walls) {
          const a = toPx(w[0], w[1])
          const b = toPx(w[2], w[3])
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // ── CHARGING STATION marker (in-facility only) ────────────────────
      // Anchored to the bottom-left strip — separated from any zone label
      // so the two text strings don't compete for the same pixels.
      if (!facility.isCampus) {
        const cs = { x: 0.01, y: 0.94, w: 0.1, h: 0.05 }
        const tl = toPx(cs.x, cs.y)
        const w = cs.w * W * viewRef.current.zoom
        const h = cs.h * H * viewRef.current.zoom
        ctx.fillStyle = PALETTE.chargeStation
        ctx.strokeStyle = PALETTE.chargeStationStroke
        ctx.lineWidth = 1
        ctx.fillRect(tl.x, tl.y, w, h)
        ctx.strokeRect(tl.x, tl.y, w, h)
        ctx.fillStyle = PALETTE.chargeStationLabel
        ctx.font = 'bold 8px JetBrains Mono, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('⚡ CHARGING', tl.x + w / 2, tl.y + h / 2)
      }

      // ── ROBOT PATHS (faint lines) ─────────────────────────────────────
      const overlay = insightOverlay
      for (const r of autonomous) {
        const isSelected = r.id === selectedId
        const a = isSelected ? 0.55 : 0.12
        ctx.strokeStyle = `rgba(1, 115, 241, ${a})`
        ctx.lineWidth = isSelected ? 2.5 : 1
        ctx.setLineDash(isSelected ? [10, 6] : [4, 4])
        ctx.beginPath()
        for (let i = 0; i < r.path.length; i++) {
          const p = toPx(r.path[i].x, r.path[i].y)
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()
        ctx.stroke()

        if (isSelected) {
          for (const wp of r.path) {
            const p = toPx(wp.x, wp.y)
            ctx.fillStyle = 'rgba(1, 115, 241, 0.45)'
            ctx.beginPath()
            ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      ctx.setLineDash([])

      // ── INSIGHT OVERLAYS ──────────────────────────────────────────────
      if (overlay === 'heatmap') {
        const hotspots = [
          { x: 0.26, y: 0.53, intensity: 0.95 },
          { x: 0.56, y: 0.39, intensity: 0.7 },
          { x: 0.45, y: 0.73, intensity: 0.6 },
          { x: 0.7, y: 0.35, intensity: 0.55 },
        ]
        for (const h of hotspots) {
          const p = toPx(h.x, h.y)
          const r = 40 * h.intensity
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
          grad.addColorStop(0, `rgba(217, 100, 95, ${0.4 * h.intensity})`)
          grad.addColorStop(1, 'rgba(217, 100, 95, 0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (overlay === 'bottleneck') {
        const a = toPx(0.12, 0.53)
        const b = toPx(0.56, 0.53)
        ctx.strokeStyle = 'rgba(217, 100, 95, 0.75)'
        ctx.lineWidth = 6
        ctx.setLineDash([8, 4])
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        ctx.setLineDash([])
        const mid = toPx(0.35, 0.5)
        ctx.fillStyle = 'rgba(217, 100, 95, 0.85)'
        ctx.font = 'bold 10px Montserrat, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('BOTTLENECK', mid.x, mid.y)
      }

      if (overlay === 'underperforming') {
        const names = ['AGV-S100-08', 'AGV-S100-09', 'AGV-T200-10', 'MiR250-01', 'OTTO 100-05']
        for (const r of autonomous) {
          if (!names.includes(r.name)) continue
          const p = toPx(r.x ?? 0.5, r.y ?? 0.5)
          const pulse = 0.5 + 0.5 * Math.sin(phaseRef.current * 3)
          ctx.strokeStyle = `rgba(217, 100, 95, ${0.5 + 0.3 * pulse})`
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, 14 + 4 * pulse, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = 'rgba(217, 100, 95, 0.85)'
          ctx.font = 'bold 9px Montserrat, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('↓ SLOW', p.x, p.y - 18)
          const pct = Math.round((r.speed / r.baseSpeed) * 100)
          ctx.fillStyle = 'rgba(217, 100, 95, 0.6)'
          ctx.font = '7px JetBrains Mono, monospace'
          ctx.fillText(`${pct}%`, p.x, p.y + 22)
        }
      }

      if (overlay === 'pathEfficiency') {
        for (const r of autonomous) {
          if (r.status !== 'active') continue
          const speedRatio = r.speed / r.baseSpeed
          // Recolor path by efficiency: blue (fast) → coral (slow)
          const color =
            speedRatio > 0.8
              ? `rgba(1, 115, 241, 0.8)`
              : speedRatio > 0.5
              ? `rgba(217, 142, 95, 0.85)`
              : `rgba(217, 100, 95, 0.9)`
          ctx.strokeStyle = color
          ctx.lineWidth = 2.5
          ctx.beginPath()
          for (let i = 0; i < r.path.length; i++) {
            const p = toPx(r.path[i].x, r.path[i].y)
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          }
          ctx.closePath()
          ctx.stroke()
        }
      }

      if (overlay === 'addRobot') {
        const path = ROBOT_PATHS[4]
        const pulse = 0.6 + 0.4 * Math.sin(phaseRef.current * 2)
        ctx.strokeStyle = `rgba(1, 115, 241, ${0.7 * pulse})`
        ctx.lineWidth = 5
        ctx.setLineDash([10, 5])
        ctx.beginPath()
        for (let i = 0; i < path.length; i++) {
          const p = toPx(path[i].x, path[i].y)
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.setLineDash([])
        const mid = toPx(path[Math.floor(path.length / 2)].x, path[Math.floor(path.length / 2)].y)
        ctx.fillStyle = 'rgba(1, 115, 241, 0.95)'
        ctx.font = 'bold 9px Montserrat, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('+1 ROBOT = −30% WAIT TIME', mid.x, mid.y - 14)
        ctx.strokeStyle = 'rgba(1, 115, 241, 0.9)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(mid.x, mid.y + 6, 10, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(mid.x - 5, mid.y + 6)
        ctx.lineTo(mid.x + 5, mid.y + 6)
        ctx.moveTo(mid.x, mid.y + 1)
        ctx.lineTo(mid.x, mid.y + 11)
        ctx.stroke()
      }

      if (overlay === 'optimizedPaths') {
        // For each active autonomous, show "current" coral and an "optimized" inset
        for (const r of autonomous.filter((a) => a.status === 'active').slice(0, 6)) {
          const path = r.path
          // current path coral
          ctx.strokeStyle = 'rgba(217, 100, 95, 0.5)'
          ctx.lineWidth = 3
          ctx.setLineDash([6, 4])
          ctx.beginPath()
          for (let i = 0; i < path.length; i++) {
            const p = toPx(path[i].x, path[i].y)
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          }
          ctx.closePath()
          ctx.stroke()
          // optimized path (inset, blue-light)
          ctx.strokeStyle = 'rgba(217, 233, 255, 0.65)'
          ctx.lineWidth = 2
          ctx.setLineDash([8, 4])
          ctx.beginPath()
          for (let i = 0; i < path.length; i++) {
            const wp = path[i]
            const center = path.reduce(
              (acc, p) => ({ x: acc.x + p.x / path.length, y: acc.y + p.y / path.length }),
              { x: 0, y: 0 },
            )
            const ix = wp.x + (center.x - wp.x) * 0.18
            const iy = wp.y + (center.y - wp.y) * 0.18
            const p = toPx(ix, iy)
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          }
          ctx.closePath()
          ctx.stroke()
        }
        ctx.setLineDash([])
        // legend
        const ll = toPx(0.5, 0.02)
        ctx.font = '9px Montserrat, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(217, 100, 95, 0.85)'
        ctx.fillText('— Current path', ll.x - 70, ll.y + 4)
        ctx.fillStyle = 'rgba(217, 233, 255, 0.9)'
        ctx.fillText('— Optimized path', ll.x + 70, ll.y + 4)
        ctx.fillStyle = PALETTE.textMuted
        ctx.font = '7px Montserrat, sans-serif'
        ctx.fillText('Based on 100,000 simulation runs', ll.x, ll.y + 14)
      }

      // ── ASSETS: AUTONOMOUS ─────────────────────────────────────────────
      for (const r of autonomous) {
        if (r.x === undefined) continue
        const isSelected = r.id === selectedId
        const p = toPx(r.x, r.y)
        const size = isSelected ? 13 : 10

        // proximity halo
        if (r.proximity > 0.05) {
          const pulse = 0.5 + 0.5 * Math.sin(phaseRef.current * 5)
          const rad = 13 + 8 * pulse
          ctx.strokeStyle = `rgba(217, 100, 95, ${r.proximity * 0.5 * (0.6 + 0.4 * pulse)})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2)
          ctx.stroke()
        }

        // body
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.fillStyle = r.color
        ctx.strokeStyle = isSelected ? '#0A1929' : 'rgba(10, 25, 41, 0.45)'
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // status pill — charging / maintenance
        if (r.status === 'charging') {
          ctx.fillStyle = PALETTE.blueLight
          ctx.font = 'bold 8px JetBrains Mono, monospace'
          ctx.textAlign = 'center'
          ctx.fillText('⚡', p.x, p.y + 3)
        } else if (r.status === 'maintenance') {
          ctx.fillStyle = PALETTE.coral
          ctx.font = 'bold 8px JetBrains Mono, monospace'
          ctx.textAlign = 'center'
          ctx.fillText('!', p.x, p.y + 3)
        }
      }

      // ── ASSETS: NON-AUTONOMOUS ─────────────────────────────────────────
      for (const t of nonAutonomous) {
        const p = toPx(t.x, t.y)
        const isSelected = t.id === selectedId
        const size = isSelected ? 9 : 7

        // Selected: draw a "current heading" line to the target so the asset's
        // direction-of-travel is visible on the map (matches the route-highlight
        // behaviour autonomous assets get from their closed-loop paths).
        if (isSelected && t.targetX !== undefined) {
          const tp = toPx(t.targetX, t.targetY)
          ctx.strokeStyle = 'rgba(217, 100, 95, 0.6)'
          ctx.lineWidth = 2
          ctx.setLineDash([8, 5])
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(tp.x, tp.y)
          ctx.stroke()
          ctx.setLineDash([])
          // target marker
          ctx.fillStyle = 'rgba(217, 100, 95, 0.7)'
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, 5, 0, Math.PI * 2)
          ctx.fill()
          // selection ring around current position
          ctx.strokeStyle = 'rgba(217, 100, 95, 0.85)'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, size + 6, 0, Math.PI * 2)
          ctx.stroke()
        }

        // spaghetti trail
        if (t.showSpaghetti && t.trail && t.trail.length > 1) {
          ctx.strokeStyle = `rgba(217, 100, 95, 0.18)`
          ctx.lineWidth = 1
          ctx.beginPath()
          for (let i = 0; i < t.trail.length; i++) {
            const pt = toPx(t.trail[i].x, t.trail[i].y)
            if (i === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
          }
          ctx.stroke()
        }

        ctx.fillStyle = t.color
        ctx.strokeStyle = isSelected ? '#0A1929' : 'rgba(10, 25, 41, 0.35)'
        ctx.lineWidth = isSelected ? 1.8 : 0.8
        // square for non-autonomous
        ctx.beginPath()
        ctx.rect(p.x - size, p.y - size, size * 2, size * 2)
        ctx.fill()
        ctx.stroke()
      }

      // ── HUMANS ─────────────────────────────────────────────────────────
      for (const h of humans) {
        const p = toPx(h.x, h.y)
        ctx.fillStyle = h.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [toPx])

  // ── Pointer interactions ──────────────────────────────────────────────
  const onPointerDown = (e) => {
    if (spaceRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = W / rect.width
      const scaleY = H / rect.height
      dragRef.current = {
        dragging: true,
        startX: (e.clientX - rect.left) * scaleX,
        startY: (e.clientY - rect.top) * scaleY,
        startPanX: viewRef.current.panX,
        startPanY: viewRef.current.panY,
      }
      canvasRef.current.style.cursor = 'grabbing'
    }
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const dx = (e.clientX - rect.left) * scaleX - dragRef.current.startX
    const dy = (e.clientY - rect.top) * scaleY - dragRef.current.startY
    viewRef.current.panX = dragRef.current.startPanX + dx
    viewRef.current.panY = dragRef.current.startPanY + dy
  }

  const onPointerUp = () => {
    dragRef.current.dragging = false
    if (canvasRef.current) {
      canvasRef.current.style.cursor = spaceRef.current ? 'grab' : 'crosshair'
    }
  }

  const onWheel = (e) => {
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08
    applyZoom(factor, mx, my)
  }

  const onClick = (e) => {
    if (spaceRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    // Convert CSS pixels → canvas internal pixels. The canvas is rendered at
    // 800x560 logical resolution but stretched by CSS, so without this the
    // click point would drift increasingly off-target on larger screens.
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const cx = (e.clientX - rect.left) * scaleX
    const cy = (e.clientY - rect.top) * scaleY
    const v = viewRef.current
    // worldX = (cx - panX) / zoom / W
    const worldX = (cx - v.panX) / v.zoom / W
    const worldY = (cy - v.panY) / v.zoom / H

    // Hit test: prefer autonomous (round, 10–13px) but include non-autonomous
    // (squares, 7px half-edge). Generous 0.05 world-unit radius so selection
    // feels forgiving without overlapping neighbours.
    const all = [...autonomous, ...nonAutonomous]
    let best = null
    let bestDist = Infinity
    for (const a of all) {
      if (a.x === undefined) continue
      const d = Math.hypot(a.x - worldX, a.y - worldY)
      if (d < bestDist) {
        bestDist = d
        best = a
      }
    }
    if (best && bestDist < 0.05) {
      onSelect(best.id === selectedId ? null : best.id)
    } else {
      onSelect(null)
    }
  }

  // Centralized zoom helper so the button controls, wheel scroll, and reset
  // share the same logic. Anchor argument is the canvas-pixel point to keep
  // stable while scaling (cursor for wheel, center for buttons).
  const applyZoom = (factor, anchorX, anchorY) => {
    const v = viewRef.current
    const newZoom = Math.max(0.5, Math.min(3, v.zoom * factor))
    if (anchorX === undefined) {
      anchorX = W / 2
      anchorY = H / 2
    }
    v.panX = anchorX - ((anchorX - v.panX) * newZoom) / v.zoom
    v.panY = anchorY - ((anchorY - v.panY) * newZoom) / v.zoom
    v.zoom = newZoom
    force((n) => n + 1)
  }
  const resetView = () => {
    viewRef.current.panX = 0
    viewRef.current.panY = 0
    viewRef.current.zoom = 1
    force((n) => n + 1)
  }

  return (
    <div className="map-wrap">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="facility-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        onClick={onClick}
        style={{ cursor: 'crosshair' }}
      />
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={() => applyZoom(1.2)} aria-label="Zoom in">
          +
        </button>
        <div className="zoom-readout">{Math.round(viewRef.current.zoom * 100)}%</div>
        <button className="zoom-btn" onClick={() => applyZoom(1 / 1.2)} aria-label="Zoom out">
          −
        </button>
        <button className="zoom-btn zoom-reset" onClick={resetView} aria-label="Reset view" title="Reset view">
          ⌂
        </button>
      </div>
    </div>
  )
}
