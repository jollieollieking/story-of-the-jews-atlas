import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { SECTION_IDS } from './lib/scroll'
import { AtlasProvider } from './state/atlas'
import { NavBar } from './components/nav/NavBar'
import { Hero } from './components/hero/Hero'
import { Atlas } from './components/atlas/Atlas'
import { Reflection } from './components/reflection/Reflection'
import { Sources } from './components/sources/Sources'
import { Footer } from './components/nav/Footer'
import { SectionBoundary } from './components/SectionBoundary'

const SECTIONS: readonly string[] = Object.values(SECTION_IDS)

export default function App() {
  /* Deep links such as /#atlas: the sections only exist after React renders, so the browser's own
     fragment scroll finds nothing. Jump there once the first frame is laid out. */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || id === SECTION_IDS.top || !SECTIONS.includes(id)) return
    const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AtlasProvider>
        <a
          href="#atlas"
          className="sr-only-focusable fixed left-4 top-4 z-[100] bg-gold px-4 py-2 text-ink label"
        >
          Skip to the interactive atlas
        </a>
        <NavBar />
        <main>
          <SectionBoundary name="The opening sequence" id="top">
            <Hero />
          </SectionBoundary>
          <SectionBoundary name="The atlas" id="atlas">
            <Atlas />
          </SectionBoundary>
          <Reflection />
          <Sources />
        </main>
        <Footer />
      </AtlasProvider>
    </MotionConfig>
  )
}
