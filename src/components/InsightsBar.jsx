import { useState } from 'react'
import { INSIGHTS } from '../data/insights'

export default function InsightsBar({ activeInsight, setActiveInsight }) {
  const [index, setIndex] = useState(0)
  const current = INSIGHTS[index]

  const prev = () => {
    setIndex((index - 1 + INSIGHTS.length) % INSIGHTS.length)
    setActiveInsight(null)
  }
  const next = () => {
    setIndex((index + 1) % INSIGHTS.length)
    setActiveInsight(null)
  }
  const toggle = () => {
    setActiveInsight(activeInsight === current.id ? null : current.id)
  }

  return (
    <div className="insights-bar">
      <button className="insights-nav" onClick={prev} aria-label="Previous insight">
        ‹
      </button>
      <div className="insights-content" onClick={toggle}>
        <div className="insights-header">
          <span className="insights-icon">{current.icon}</span>
          <span className="insights-title">{current.title}</span>
          <span className="insights-counter">
            {index + 1}/{INSIGHTS.length}
          </span>
        </div>
        <div className="insights-desc">{current.description}</div>
        {current.robots && (
          <div className="insights-robots">
            {current.robots.map((r) => (
              <span key={r} className="insights-robot-tag">
                {r}
              </span>
            ))}
          </div>
        )}
        <div className={`insights-toggle ${activeInsight === current.id ? 'active' : ''}`}>
          {activeInsight === current.id ? 'Showing on map — Click to hide' : 'Click to visualize on map'}
        </div>
      </div>
      <button className="insights-nav" onClick={next} aria-label="Next insight">
        ›
      </button>
    </div>
  )
}
