/** Map colours, kept in one place so the WebGL style, HTML markers and SVG fallback agree. */
export const MAP_COLORS = {
  ocean: '#070a0e',
  land: '#141a21',
  landWarm: '#171b20',
  coast: 'rgba(227, 203, 156, 0.2)',
  coastGlow: 'rgba(199, 164, 106, 0.16)',
  border: 'rgba(243, 238, 229, 0.075)',
  graticule: 'rgba(199, 164, 106, 0.075)',
  gold: '#c7a46a',
  goldSoft: '#e3cb9c',
  goldDim: '#8a7046',
  parchment: '#f3eee5',
  memorial: '#b8b2a7',
  /* Street-level detail (OpenFreeMap) */
  water: '#080c11',
  waterway: 'rgba(8, 12, 17, 0.9)',
  landuse: 'rgba(243, 238, 229, 0.018)',
  park: 'rgba(150, 160, 120, 0.045)',
  road: 'rgba(243, 238, 229, 0.11)',
  roadMajor: 'rgba(227, 203, 156, 0.16)',
  building: 'rgba(243, 238, 229, 0.045)',
  buildingEdge: 'rgba(243, 238, 229, 0.07)',
} as const

/** rgba() string for the antique gold at a given alpha. */
export const gold = (alpha: number) => `rgba(199, 164, 106, ${alpha})`
export const goldSoft = (alpha: number) => `rgba(227, 203, 156, ${alpha})`
export const memorial = (alpha: number) => `rgba(184, 178, 167, ${alpha})`
