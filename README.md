# The Story of the Jews: Over the Rainbow (interactive atlas)

An interactive historical atlas based on Episode 4, "Over the Rainbow", of Simon Schama's documentary
series *The Story of the Jews* (BBC / PBS). It follows seven chapters, from the shtetls and the Pale of
Settlement in Eastern Europe, across the Atlantic to New York's Lower East Side and Jewish American
culture, to the destruction of Eastern European Jewish life in the Holocaust.

Made as an 11th-grade history project. What the episode shows is kept separate from extra historical
context, and every story card lists its sources. Routes are generalized corridors and boundaries are
approximate and dated. The chapter sequence is a thematic journey. It is not one person's or one family's route.

## Run it

Requires Node.js 20.19+ or 22.12+ (needed by Vite 8). There is no backend and no API key.

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

## How to use it

- **Begin the guided journey** steps through the seven chapters in order.
- **Free explore** lets you click any place on the map or pick a period on the timeline.
- The **Reflection** section closes the journey. **Sources & Credits** lists every source, image credit and map dataset.

The atlas works with keyboard only and respects the "reduce motion" system setting. Without WebGL it
falls back to a static map.

## Project structure

```
src/
  App.tsx, main.tsx, index.css   app shell and design tokens (Tailwind v4 @theme)
  types.ts                       shared data types
  state/                         atlas reducer, derived view and React context
  data/                          places, chapters, periods, routes, overlays, sources
    stories/                     the story cards, one file per chapter
  components/
    hero/                        title sequence and globe (three.js)
    atlas/                       atlas stage: header, timeline, story panel, comparison
    map/                         MapLibre map, markers, routes and the non-WebGL fallback
    nav/, reflection/, sources/  site navigation, closing reflection, sources and credits
    ui/                          shared small components
  hooks/, lib/                   media queries, WebGL detection, scrolling, geo helpers
public/images/                   archival images (credits in the Sources section)
```

## Data and credits

- Country and land outlines: [Natural Earth](https://www.naturalearthdata.com/) via the
  [`world-atlas`](https://github.com/topojson/world-atlas) package.
- Street-level detail when zoomed in: [OpenFreeMap](https://openfreemap.org/) vector tiles
  ([OpenMapTiles](https://openmaptiles.org/) schema, © OpenStreetMap contributors). This needs an internet connection.
  The rest of the atlas works offline.
- Historical sources and image credits are listed in full in the in-app **Sources & Credits** section
  (data in `src/data/sources.ts` and `src/data/stories/`).

Built with React, TypeScript, Vite, Tailwind CSS, Motion, MapLibre GL JS and three.js.
