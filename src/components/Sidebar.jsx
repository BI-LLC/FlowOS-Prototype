import { useMemo, useState } from 'react'
import { ASSET_TYPE_FILTERS } from '../data/fleet'
import DetailCard from './DetailCard'

export default function Sidebar({
  autonomous,
  nonAutonomous,
  humans,
  selectedId,
  onSelect,
  latency,
  onToggleSpaghetti,
}) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [autoOpen, setAutoOpen] = useState(true)
  const [forkOpen, setForkOpen] = useState(true)

  const matchesQuery = (a, q) => {
    if (!q) return true
    const s = q.toLowerCase()
    return (
      (a.name || '').toLowerCase().includes(s) ||
      (a.vendor || '').toLowerCase().includes(s) ||
      (a.model || '').toLowerCase().includes(s) ||
      (a.task || '').toLowerCase().includes(s)
    )
  }
  const matchesType = (a, t) => {
    if (t === 'All') return true
    return a.type === t
  }

  const autoVisible = useMemo(
    () => autonomous.filter((a) => matchesQuery(a, search) && matchesType(a, typeFilter)),
    [autonomous, search, typeFilter],
  )
  const forkVisible = useMemo(
    () =>
      nonAutonomous.filter(
        (a) => matchesQuery(a, search) && (typeFilter === 'All' || a.type === typeFilter),
      ),
    [nonAutonomous, search, typeFilter],
  )

  const latencyColor = latency < 8 ? 'var(--blue)' : latency < 15 ? 'var(--coral)' : 'var(--coral)'

  const selected = useMemo(
    () =>
      selectedId
        ? autonomous.find((a) => a.id === selectedId) || nonAutonomous.find((a) => a.id === selectedId)
        : null,
    [selectedId, autonomous, nonAutonomous],
  )

  return (
    <>
      <div className="left-panel">
        <div className="panel-header">
          <div className="brand">
            <img src="./verticalai-logo.png" alt="VerticalAI" className="brand-mark" />
            <div className="brand-text">
              <div className="brand-product">FlowOS</div>
              <div className="brand-parent">VerticalAI · Product</div>
            </div>
          </div>
          <p className="brand-tagline">
            The Digital AI orchestration layer for plant logistics — one brain for every robot,
            vehicle, and workflow on the floor.
          </p>
        </div>

        <div className="latency-bar">
          <span className="label">Connection</span>
          <div className="latency-indicator">
            <span className="latency-dot" style={{ background: latencyColor }} />
            <span className="latency-value" style={{ color: latencyColor }}>
              {latency.toFixed(1)}s
            </span>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search assets, vendors, tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="type-filters">
          {ASSET_TYPE_FILTERS.map((t) => (
            <button
              key={t}
              className={`type-chip ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="panel-body">
          <div className="section">
            <div className="section-header" onClick={() => setAutoOpen(!autoOpen)}>
              <span className={`section-chevron ${autoOpen ? 'open' : ''}`}>▶</span>
              <span className="section-icon" style={{ background: 'var(--blue)' }} />
              <span className="section-title">Autonomous Assets</span>
              <span className="section-count">{autoVisible.length}</span>
            </div>
            {autoOpen && (
              <div className="asset-list">
                {autoVisible.map((a) => (
                  <div
                    key={a.id}
                    className={`asset-item ${selectedId === a.id ? 'selected' : ''}`}
                    onClick={() => onSelect(a.id === selectedId ? null : a.id)}
                  >
                    <span className="asset-dot" style={{ background: a.color }} />
                    <div className="asset-info">
                      <div className="asset-name">{a.name}</div>
                      <div className="asset-meta">
                        {a.vendor} · {a.application}
                      </div>
                    </div>
                    <span className={`asset-status ${a.status}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <div className="section-header" onClick={() => setForkOpen(!forkOpen)}>
              <span className={`section-chevron ${forkOpen ? 'open' : ''}`}>▶</span>
              <span className="section-icon" style={{ background: 'var(--silver)' }} />
              <span className="section-title">
                {forkVisible[0]?.type === 'Truck' ? 'Trucks' : 'Forklifts'}
              </span>
              <span className="section-count">{forkVisible.length}</span>
            </div>
            {forkOpen && (
              <div className="asset-list">
                {forkVisible.map((a) => (
                  <div
                    key={a.id}
                    className={`asset-item ${selectedId === a.id ? 'selected' : ''}`}
                    onClick={() => onSelect(a.id === selectedId ? null : a.id)}
                  >
                    <span className="asset-dot" style={{ background: a.color }} />
                    <div className="asset-info">
                      <div className="asset-name">{a.name}</div>
                      <div className="asset-meta">
                        {a.vendor} · {a.type}
                      </div>
                    </div>
                    <span className="asset-status active">active</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section">
            <div className="section-header" style={{ cursor: 'default' }}>
              <span className="section-chevron" style={{ visibility: 'hidden' }}>
                ▶
              </span>
              <span
                className="section-icon"
                style={{ background: 'var(--coral)', borderRadius: '50%' }}
              />
              <span className="section-title">Personnel on Floor</span>
              <span className="section-count">{humans.length}</span>
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <span className="footer-dot" />
          <span>Confidential &amp; Shared under NDA</span>
        </div>
      </div>

      {selected && <DetailCard asset={selected} onClose={() => onSelect(null)} onToggleSpaghetti={onToggleSpaghetti} />}
    </>
  )
}
