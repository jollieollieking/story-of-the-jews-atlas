import type { ReactNode } from 'react'
import { ExternalLink as ExternalLinkIcon } from 'lucide-react'

interface ExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
  /** Hide the trailing arrow icon (e.g. for superscript citation links). */
  bare?: boolean
  title?: string
  'aria-label'?: string
}

/** A link that opens in a new tab, says so to screen readers, and shows a small external icon. */
export function ExternalLink({ href, children, className = '', bare = false, title, ...rest }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={rest['aria-label']}
      className={`underline decoration-line-strong decoration-1 underline-offset-[3px] transition-colors duration-300 hover:decoration-gold hover:text-gold-soft ${className}`}
    >
      {bare ? children : <WithIcon>{children}</WithIcon>}
      {!rest['aria-label'] && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}

const icon = (
  <ExternalLinkIcon aria-hidden="true" strokeWidth={1.5} className="ml-1 inline-block size-[0.85em] -translate-y-px opacity-70" />
)

/** Keeps the icon on the same line as the last word, so it never wraps onto a line by itself. */
function WithIcon({ children }: { children: ReactNode }) {
  if (typeof children !== 'string') {
    return (
      <>
        {children}
        {icon}
      </>
    )
  }
  const cut = children.trimEnd().lastIndexOf(' ')
  const head = cut >= 0 ? children.slice(0, cut + 1) : ''
  const tail = cut >= 0 ? children.slice(cut + 1) : children
  return (
    <>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        {icon}
      </span>
    </>
  )
}
