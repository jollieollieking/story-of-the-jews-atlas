import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Menu, X } from 'lucide-react'
import type { SectionId } from '../../lib/scroll'
import { SITE_LINKS, navigateToSection, useStartGuidedJourney } from './navigation'
import { Wordmark } from './Wordmark'

const EASE = [0.22, 1, 0.36, 1] as const
const OBSERVED: SectionId[] = ['top', 'atlas', 'reflection', 'sources']
const SHEET_ID = 'site-menu-sheet'
const WIDE_QUERY = '(min-width: 1024px)'

/** True once the page has scrolled past the very top. */
function useScrolled(threshold = 16) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold])
  return scrolled
}

/** The section crossing the middle of the viewport. */
function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId | null>(null)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const visible = new Set<SectionId>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        }
        setActive(ids.find((id) => visible.has(id)) ?? null)
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    const observeAll = () => {
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      }
    }
    observeAll()
    /* Sections owned by other components may mount a moment later. */
    const late = window.setTimeout(observeAll, 1200)
    return () => {
      window.clearTimeout(late)
      observer.disconnect()
    }
  }, [ids])
  return active
}

function linkHandler(id: SectionId, before?: () => void) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    if (before) before()
    else navigateToSection(id)
  }
}

export function NavBar() {
  const scrolled = useScrolled()
  const active = useActiveSection(OBSERVED)
  const startGuided = useStartGuidedJourney()
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  /** Where to go once the mobile sheet has closed (null = return focus to the menu button). */
  const pendingRef = useRef<(() => void) | null>(null)

  const closeSheet = useCallback((then?: () => void) => {
    pendingRef.current = then ?? null
    setOpen(false)
  }, [])

  /* Lock page scroll while the sheet is open; afterwards run the pending navigation or restore focus. */
  const wasOpen = useRef(false)
  useLayoutEffect(() => {
    if (open) {
      wasOpen.current = true
      const root = document.documentElement
      const previous = root.style.overflow
      root.style.overflow = 'hidden'
      return () => {
        root.style.overflow = previous
      }
    }
    if (wasOpen.current) {
      wasOpen.current = false
      const pending = pendingRef.current
      pendingRef.current = null
      if (pending) pending()
      else menuButtonRef.current?.focus()
    }
  }, [open])

  /* The sheet only exists on narrow screens: close it if the window widens past the breakpoint. */
  useEffect(() => {
    if (!open || !window.matchMedia) return
    const mql = window.matchMedia(WIDE_QUERY)
    const onChange = () => mql.matches && closeSheet()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [open, closeSheet])

  const solid = scrolled || open

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16">
        {/* Background layer kept separate so its backdrop-filter never traps fixed descendants. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-700 ease-cinema ${
            solid ? 'border-line bg-ink/80 backdrop-blur-md' : 'border-transparent bg-transparent'
          }`}
        />
        {!solid && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/50 to-transparent"
          />
        )}
        <nav
          aria-label="Primary"
          className="relative flex h-full items-center justify-between gap-6 px-4 md:px-10 xl:px-14"
        >
          <a
            href="#top"
            onClick={linkHandler('top')}
            className="-m-2 p-2 transition-opacity duration-500 hover:opacity-80"
            aria-label="The Story of the Jews, back to the beginning"
          >
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-3 lg:flex">
            <li>
              <NavLink id="atlas" label="Atlas" active={active === 'atlas'} />
            </li>
            <li>
              <button
                type="button"
                onClick={startGuided}
                className="label mx-2 inline-flex items-center gap-2 border border-gold/50 px-4 py-2 !tracking-[0.2em] text-gold transition-colors duration-500 hover:border-gold hover:bg-gold/10 hover:text-gold-soft"
              >
                Guided Journey
              </button>
            </li>
            {SITE_LINKS.slice(1).map((link) => (
              <li key={link.id}>
                <NavLink id={link.id} label={link.label} active={active === link.id} />
              </li>
            ))}
          </ul>

          <button
            ref={menuButtonRef}
            type="button"
            className="-mr-2 inline-flex h-11 items-center gap-2.5 px-2 text-parchment lg:hidden"
            aria-expanded={open}
            aria-controls={SHEET_ID}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="label text-mist">Menu</span>
            <Menu className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <MobileSheet
            active={active}
            onClose={() => closeSheet()}
            onNavigate={(id) => closeSheet(() => navigateToSection(id))}
            onGuided={() => closeSheet(startGuided)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ id, label, active }: { id: SectionId; label: string; active: boolean }) {
  return (
    <a
      href={`#${id}`}
      onClick={linkHandler(id)}
      aria-current={active ? 'location' : undefined}
      className={`label group relative inline-flex h-10 items-center px-3 !tracking-[0.2em] transition-colors duration-500 ${
        active ? 'text-parchment' : 'text-mist hover:text-parchment'
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute inset-x-3 bottom-1.5 h-px origin-left bg-gold transition-transform duration-700 ease-cinema ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
        }`}
      />
    </a>
  )
}

interface SheetProps {
  active: SectionId | null
  onClose: () => void
  onNavigate: (id: SectionId) => void
  onGuided: () => void
}

function MobileSheet({ active, onClose, onNavigate, onGuided }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    firstLinkRef.current?.focus()
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab' || !sheetRef.current) return
    const focusables = Array.from(sheetRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const items: { key: string; node: (className: string) => ReactNode }[] = [
    {
      key: 'atlas',
      node: (className) => (
        <a
          ref={firstLinkRef}
          href="#atlas"
          onClick={linkHandler('atlas', () => onNavigate('atlas'))}
          aria-current={active === 'atlas' ? 'location' : undefined}
          className={className}
        >
          Atlas
        </a>
      ),
    },
    {
      key: 'guided',
      node: (className) => (
        <button type="button" onClick={onGuided} className={`${className} text-left`}>
          <span className="italic text-gold-soft">Guided Journey</span>
          <ArrowRight className="ml-3 inline h-6 w-6 text-gold" strokeWidth={1} aria-hidden="true" />
        </button>
      ),
    },
    ...SITE_LINKS.slice(1).map((link) => ({
      key: link.id,
      node: (className: string) => (
        <a
          href={`#${link.id}`}
          onClick={linkHandler(link.id, () => onNavigate(link.id))}
          aria-current={active === link.id ? 'location' : undefined}
          className={className}
        >
          {link.label}
        </a>
      ),
    })),
  ]

  return (
    <motion.div
      ref={sheetRef}
      id={SHEET_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/[0.97] backdrop-blur-xl lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div aria-hidden="true" className="grain absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgb(199_164_106/0.08),transparent_60%)]"
      />

      <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-line px-4 md:px-10">
        <Wordmark />
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex h-11 items-center gap-2.5 px-2 text-parchment"
          aria-label="Close menu"
        >
          <span className="label text-mist">Close</span>
          <X className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Site menu" className="relative flex flex-1 flex-col justify-center overflow-y-auto px-5 py-10 sm:px-8">
        <ol className="border-t border-line">
          {items.map((item, i) => (
            <motion.li
              key={item.key}
              className="border-b border-line"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 + i * 0.06 }}
            >
              <div className="flex items-baseline gap-5">
                <span aria-hidden="true" className="label w-6 shrink-0 text-gold-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.node(
                  'flex-1 py-5 font-serif text-[2.35rem] font-light leading-none text-parchment transition-colors duration-500 hover:text-gold-soft aria-[current=location]:text-gold-soft',
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </nav>

      <p className="label relative px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-ash sm:px-8">
        Episode IV · Over the Rainbow
      </p>
    </motion.div>
  )
}
