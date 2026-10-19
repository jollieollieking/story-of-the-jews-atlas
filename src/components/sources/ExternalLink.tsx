import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface ExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
  /** Show the small diagonal arrow after the text. */
  arrow?: boolean
  /** Overrides the accessible name when the visible text is not descriptive on its own. */
  label?: string
}

function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      strokeWidth={1.25}
      className="ml-1 inline-block h-[0.85em] w-[0.85em] -translate-y-px align-baseline text-gold transition-transform duration-500 ease-cinema group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
    />
  )
}

/** Opens in a new tab, safely, and tells screen-reader users that it does. */
export function ExternalLink({ href, children, className = '', arrow = true, label }: ExternalLinkProps) {
  let content: ReactNode = children
  if (arrow) {
    if (typeof children === 'string') {
      /* Keep the arrow on the same line as the last word so it never wraps on its own. */
      const cut = children.trimEnd().lastIndexOf(' ')
      content = (
        <>
          {cut > 0 ? children.slice(0, cut + 1) : ''}
          <span className="whitespace-nowrap">
            {cut > 0 ? children.slice(cut + 1) : children}
            <Arrow />
          </span>
        </>
      )
    } else {
      content = (
        <>
          {children}
          <Arrow />
        </>
      )
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ? `${label} (opens in a new tab)` : undefined}
      className={`group/link transition-colors duration-500 ${className}`}
    >
      {content}
      {!label && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
