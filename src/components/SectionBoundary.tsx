import { Component, type ReactNode } from 'react'

interface Props {
  /** Name shown in the fallback, e.g. "The atlas". */
  name: string
  /** Section id to keep on the fallback so navigation links still land somewhere. */
  id: string
  children: ReactNode
}

/** Keeps one section's runtime error from blanking the whole page (nav, reflection and sources stay usable). */
export class SectionBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(`[${this.props.name}]`, error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section id={this.props.id} className="flex min-h-[60dvh] items-center justify-center bg-ink px-6 py-24">
        <div className="max-w-md text-center">
          <p className="label text-gold">Something went wrong</p>
          <p className="mt-4 font-serif text-3xl text-parchment">{this.props.name} could not be displayed.</p>
          <p className="mt-3 text-sm text-mist">The rest of the exhibit still works. Reloading the page usually fixes this.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="label mt-8 border border-gold/60 px-6 py-3 text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            Reload the page
          </button>
        </div>
      </section>
    )
  }
}
