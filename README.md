# FlowOS — Live Orchestration Prototype

The Digital AI orchestration layer for plant logistics — one brain for every robot, vehicle, and workflow on the floor.

This is the interactive prototype for **FlowOS**, the orchestration product inside VerticalAI OS. It rebrands and extends the earlier OmniFlow concept demo, with all blueprints, fleet data, and insight overlays carried over and recolored to the VerticalAI brand system (blue `#0173F1` + coral `#D9645F` + neutrals).

## What you'll see

- **5 facility blueprints + 1 campus view** — Facility A (heavy mfg), B (warehouse), C (vehicle assembly), D (food processing), E (electronics), and the Decatur Bird Eye View showing cross-facility shuttle traffic.
- **22 autonomous assets** across 7 vendors (MiR, Gulf, OTTO, JBT, Seegrid, Oasis, VerticalAI) plus 8 forklifts and 20 personnel — all animated in real time on the canvas.
- **6 insight overlays** the operator can cycle through: Congestion Heatmap, Bottleneck Detection, Underperforming Robots, Path Efficiency Score, Add Robot Recommendation, Optimized Path Suggestion.
- **Interactions**: click any asset to see its battery/speed/payload/task; click a forklift's "Show Spaghetti Map" button to overlay its historical trail; switch facilities from the dropdown; hold Space + drag to pan; scroll to zoom.

## Stack

- React 18 + Vite 5
- Pure HTML5 canvas for the simulation (no chart library — the render loop runs at 60fps and handles ~50 moving entities)
- Montserrat (UI) + JetBrains Mono (telemetry) — matches the VerticalAI brand system
- No backend; all data lives in `src/data/`

## Run locally

```bash
npm install
npm run dev
```

Then open the printed URL (usually http://localhost:5173).

## Deploy to Vercel

Two options:

**A. From the Vercel dashboard (easiest)**
1. Push this folder to a GitHub repo
2. In Vercel: New Project → Import the repo
3. Framework preset will auto-detect as **Vite** — leave defaults
4. Deploy

**B. From the CLI**
```bash
npm install -g vercel
vercel        # follow prompts; pick "Vite" as framework if asked
vercel --prod # promote to production once you're happy
```

## File map

```
flowos-prototype/
├── index.html                  # loads Montserrat + JetBrains Mono
├── package.json
├── vite.config.js
├── public/
│   └── verticalai-logo.png     # used in sidebar + favicon
└── src/
    ├── main.jsx                # React entry
    ├── App.jsx                 # top-level state + animation loop
    ├── App.css                 # all design tokens & layout
    ├── data/
    │   ├── facilities.js       # 6 blueprints (zones, walls, forbidden areas)
    │   ├── fleet.js            # robots, forklifts, trucks, humans
    │   └── insights.js         # the 6 rotating overlay tiles
    ├── lib/
    │   └── simulation.js       # spawn + step functions, proximity, trails
    └── components/
        ├── Sidebar.jsx         # branded left panel
        ├── FacilityMap.jsx     # canvas renderer (the main work)
        ├── DetailCard.jsx      # selected-asset details
        └── InsightsBar.jsx     # rotating bottom strip
```

## Brand notes

Following VerticalAI's brand rules: blue and coral only, with neutrals. The original OmniFlow used orange for forklifts, yellow for charging, green for optimized paths, and red for alerts. Here they map to:

| Original   | FlowOS                              | Token              |
|------------|-------------------------------------|--------------------|
| Blue       | Autonomous robots                   | `--blue` (#0173F1) |
| Orange     | Forklifts / trucks (non-autonomous) | `--silver` (#94A3B8) |
| Red        | Humans / alerts / bottlenecks       | `--coral` (#D9645F) |
| Yellow     | Charging state / +1 robot callout   | `--blue-100` (#D9E9FF) |
| Green      | Optimized path suggestion           | `--blue-100` |

Asset categories stay visually distinct, and every accent is strictly on-brand.

## Known placeholders

- The "Add Robot Recommendation" and "Optimized Path Suggestion" insights are illustrative — they show *what the recommendation surface looks like*. The real ranking would come from the optimization layer described in `FlowOS_PRD_May2026.pdf` (objective function, simulation runs, scenario scoring).
- All KPIs in the insight copy (95% congestion, 40% throughput reduction, 30% wait-time reduction, 100,000 simulation runs) are carried over from the OmniFlow source. Worth a sanity check against current PRD numbers before showing externally.

— Confidential & Shared under NDA
