export default function DetailCard({ asset, onClose, onToggleSpaghetti }) {
  if (!asset) return null

  const stop = (e) => e.stopPropagation()
  const isAutonomous = asset.category === 'autonomous'

  // Battery color thresholds — brand-aligned (blue good, coral low)
  const batteryColor =
    (asset.battery ?? 100) > 50 ? 'var(--blue)' : (asset.battery ?? 100) > 20 ? 'var(--blue-light)' : 'var(--coral)'

  const statusColor = {
    active: 'var(--blue)',
    charging: 'var(--blue-light)',
    maintenance: 'var(--coral)',
  }[asset.status] || 'var(--ink-mid)'

  if (isAutonomous) {
    return (
      <div className="detail-card right-side" onClick={stop} onMouseDown={stop} onMouseUp={stop}>
        <div className="detail-card-header">
          <div>
            <div className="detail-card-title">{asset.name}</div>
            <div className="detail-card-subtitle">
              {asset.vendor} · {asset.model}
            </div>
            <span
              className="detail-card-type-badge"
              style={{ background: 'rgba(1, 115, 241, 0.18)', color: 'var(--blue)' }}
            >
              {asset.application}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="detail-grid">
          <div className="detail-cell">
            <div className="label">Battery</div>
            <div className="value" style={{ color: batteryColor }}>
              {asset.battery}%
            </div>
            <div className="battery-bar">
              <div
                className="battery-fill"
                style={{ width: `${asset.battery}%`, background: batteryColor }}
              />
            </div>
          </div>
          <div className="detail-cell">
            <div className="label">Speed</div>
            <div className="value">
              {(asset.speed || 0).toFixed(2)}{' '}
              <span style={{ fontSize: 10, color: 'var(--ink-mid)' }}>m/s</span>
            </div>
          </div>
          <div className="detail-cell">
            <div className="label">Payload</div>
            <div className="value">
              {asset.payload}
              <span style={{ fontSize: 10, color: 'var(--ink-mid)' }}>
                {' '}/ {asset.maxPayload} kg
              </span>
            </div>
          </div>
          <div className="detail-cell">
            <div className="label">Status</div>
            <div className="value" style={{ color: statusColor, textTransform: 'capitalize' }}>
              {asset.status}
            </div>
          </div>
          <div className="detail-cell wide">
            <div className="label">Current Task</div>
            <div className="value" style={{ fontSize: 13 }}>
              {asset.task}
            </div>
          </div>
          <div className="detail-cell wide">
            <div className="label">Type</div>
            <div className="value" style={{ fontSize: 13 }}>
              {asset.type}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Non-autonomous (forklift / truck)
  return (
    <div className="detail-card right-side" onClick={stop} onMouseDown={stop} onMouseUp={stop}>
      <div className="detail-card-header">
        <div>
          <div className="detail-card-title">{asset.name}</div>
          <div className="detail-card-subtitle">
            {asset.vendor} · {asset.model}
          </div>
          <span
            className="detail-card-type-badge"
            style={{ background: 'rgba(90, 104, 120, 0.12)', color: 'var(--ink-2)' }}
          >
            {asset.type}
          </span>
        </div>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-cell wide">
          <div className="label">Active Task</div>
          <div className="value" style={{ fontSize: 13 }}>
            {asset.task}
          </div>
        </div>
        <div className="detail-cell">
          <div className="label">Speed</div>
          <div className="value">
            {(asset.speed || 0).toFixed(2)}
            <span style={{ fontSize: 10, color: 'var(--ink-mid)' }}> m/s</span>
          </div>
        </div>
        <div className="detail-cell">
          <div className="label">Vendor</div>
          <div className="value" style={{ fontSize: 12 }}>
            {asset.vendor}
          </div>
        </div>
      </div>

      <button
        className="update-routing-btn"
        onClick={(e) => {
          e.stopPropagation()
          onToggleSpaghetti && onToggleSpaghetti(asset.id)
        }}
      >
        {asset.showSpaghetti ? 'Hide Spaghetti Map' : 'Show Spaghetti Map'}
      </button>
    </div>
  )
}
