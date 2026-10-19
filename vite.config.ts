import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          /* React first: otherwise fiber's shared deps drag React into the 'three' chunk, and the entry
             then preloads all of three.js even though the hero globe is lazy-loaded. */
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
          if (id.includes('node_modules/maplibre-gl')) return 'maplibre'
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'three'
        },
      },
    },
  },
})
