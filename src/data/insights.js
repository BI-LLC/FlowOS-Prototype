// Insight overlays shown in the bottom bar. Each tile recolors the map
// to highlight a different operational pattern (heatmap, bottleneck,
// underperforming robots, etc).

export const INSIGHTS = [
  {
    id: 'heatmap',
    title: 'Congestion Heatmap',
    description:
      'High-traffic intersections where robots frequently slow down. Main aisle junction at (26%, 53%) shows 95% congestion intensity.',
    icon: '◉',
  },
  {
    id: 'bottleneck',
    title: 'Bottleneck Detection',
    description:
      'Main central aisle between left corridor and central production is a recurring bottleneck causing 40% throughput reduction.',
    icon: '◢',
  },
  {
    id: 'underperforming',
    title: 'Underperforming Robots',
    description:
      'These robots are underperforming because they are being slowed down multiple times on congested routes.',
    icon: '↓',
    robots: ['AGV-S100-08', 'AGV-S100-09', 'AGV-T200-10', 'MiR250-01', 'OTTO 100-05'],
  },
  {
    id: 'pathEfficiency',
    title: 'Path Efficiency Score',
    description:
      'Each robot path is color-graded: blue = full speed, coral = frequently slowed. Routes through central aisle score lowest.',
    icon: '◈',
  },
  {
    id: 'addRobot',
    title: 'Add Robot Recommendation',
    description:
      'This path (Main Aisle → Central Production) can be more productive by adding one more robot. Based on data, you can reduce avg. waiting time by 30%.',
    icon: '+',
    path: 4,
  },
  {
    id: 'optimizedPaths',
    title: 'Optimized Path Suggestion',
    description:
      'Based on 100,000 simulation runs, these paths could be optimized to avoid congestions. Light blue = suggested optimized route, coral = current congested route.',
    icon: '◇',
  },
]
