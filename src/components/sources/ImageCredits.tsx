import { useState, type ReactNode } from 'react'
import { chaptersById } from '../../data'
import type { ArchivalImage } from '../../types'
import { ExternalLink } from './ExternalLink'
import { groupImagesByChapter, pad2 } from './citations'

/** Credits for every archival image: thumbnail, caption, creator, institution, license and source page. */
export function ImageCredits({ images }: { images: ArchivalImage[] }) {
  const groups = groupImagesByChapter(images)

  return (
    <div>
      {/* Column headings for wide screens; each row also carries its own labels for screen readers and phones. */}
      <div
        aria-hidden="true"
        className="label hidden gap-x-6 pb-4 text-ash lg:grid lg:grid-cols-[5rem_minmax(0,2.6fr)_minmax(0,1.25fr)_minmax(0,0.85fr)_6.5rem]"
      >
        <span>Image</span>
        <span>Caption</span>
        <span>Creator &amp; holder</span>
        <span>License</span>
        <span className="text-right">Source</span>
      </div>

      <div className="space-y-10 lg:space-y-8">
        {groups.map((group) => {
          const chapter = group.chapterId ? chaptersById[group.chapterId] : null
          return (
            <div key={group.chapterId ?? 'other'}>
              <h4 className={`label border-t border-line-strong pt-4 ${chapter?.tone === 'solemn' ? 'text-memorial' : 'text-gold'}`}>
                {chapter ? `Chapter ${pad2(chapter.number)} · ${chapter.title}` : 'Other images'}
              </h4>
              <ul>
                {group.images.map((image) => (
                  <ImageRow key={image.id} image={image} />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ImageRow({ image }: { image: ArchivalImage }) {
  return (
    <li className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-b border-line py-5 last:border-b-0 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[5rem_minmax(0,2.6fr)_minmax(0,1.25fr)_minmax(0,0.85fr)_6.5rem] lg:items-start">
      <Thumbnail image={image} />

      <div className="min-w-0">
        <p className="text-sm leading-relaxed text-parchment/90">{image.caption}</p>
        {image.date && <p className="label mt-2.5 !tracking-[0.16em] text-mist">{image.date}</p>}
      </div>

      <dl className="col-span-2 grid gap-2.5 text-sm sm:col-span-1 sm:col-start-2 lg:contents">
        <Field label="Creator">
          <span className="text-parchment/85">{image.creator}</span>
          {image.institution && <span className="mt-0.5 block text-mist">{image.institution}</span>}
        </Field>
        <Field label="License">
          {image.licenseUrl ? (
            <ExternalLink href={image.licenseUrl} arrow={false} className="text-parchment/85 underline decoration-line-strong underline-offset-4 hover:text-gold-soft hover:decoration-gold">
              {image.license}
            </ExternalLink>
          ) : (
            <span className="text-parchment/85">{image.license}</span>
          )}
        </Field>
        <Field label="Source" className="lg:text-right">
          <ExternalLink
            href={image.sourceUrl}
            label={`View source: ${image.caption}`}
            className="text-gold hover:text-gold-soft"
          >
            View source
          </ExternalLink>
        </Field>
      </dl>
    </li>
  )
}

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3 lg:block ${className}`}>
      <dt className="label !tracking-[0.2em] text-ash lg:sr-only">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  )
}

/** Small pre-sized copy next to the original (`/images/<chapter>/thumbs/<file>`); the original is the fallback. */
function thumbSrc(src: string) {
  return src.replace(/\/([^/]+)$/, '/thumbs/$1')
}

function Thumbnail({ image }: { image: ArchivalImage }) {
  /* Try the thumbnail first, then the full-size original, then fall back to the placeholder dot. */
  const [stage, setStage] = useState<'thumb' | 'full' | 'failed'>('thumb')
  const src = image.src ? (stage === 'thumb' ? thumbSrc(image.src) : image.src) : ''
  return (
    <div className="relative aspect-square w-full overflow-hidden border border-line bg-ink-3 sm:row-span-2 lg:row-span-1">
      {stage !== 'failed' && src ? (
        <img
          key={src}
          src={src}
          alt=""
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          onError={() => setStage((current) => (current === 'thumb' ? 'full' : 'failed'))}
          className="h-full w-full object-cover opacity-90 saturate-[0.85]"
        />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-dim" />
        </span>
      )}
    </div>
  )
}
