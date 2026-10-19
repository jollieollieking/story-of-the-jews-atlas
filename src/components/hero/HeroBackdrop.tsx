/**
 * Atmosphere layered over the globe: an engraved portolan-chart texture (compass rose and rhumb
 * lines, as on 14th–16th-century sea charts), soft warm light, scrims that keep the text legible,
 * a vignette and film grain. Purely decorative.
 */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Warm light falling on the globe from the upper left. */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(60% 55% at 62% 30%, rgb(199 164 106 / 0.07), transparent 70%), radial-gradient(40% 40% at 18% 12%, rgb(243 238 229 / 0.035), transparent 70%)',
        }}
      />
      <PortolanTexture />
      {/* Legibility scrims: from the left on wide screens, from the top on narrow ones. On tablets
          (768–1279px) the copy spans most of the width and the globe's arc runs behind it, so the
          left scrim reaches further and stays denser there. */}
      <div
        className="absolute inset-0 hidden md:block xl:hidden"
        style={{
          background:
            'linear-gradient(90deg, rgb(8 11 16 / 0.92) 0%, rgb(8 11 16 / 0.82) 34%, rgb(8 11 16 / 0.6) 58%, rgb(8 11 16 / 0.2) 78%, transparent 92%)',
        }}
      />
      <div
        className="absolute inset-0 hidden xl:block"
        style={{
          background:
            'linear-gradient(90deg, rgb(8 11 16 / 0.92) 0%, rgb(8 11 16 / 0.72) 26%, rgb(8 11 16 / 0.25) 46%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgb(8 11 16 / 0.6) 0%, rgb(8 11 16 / 0.45) 38%, rgb(8 11 16 / 0.15) 58%, transparent 72%)',
        }}
      />
      {/* Quiet corner behind the globe key. */}
      <div
        className="absolute inset-0 hidden xl:block"
        style={{ background: 'radial-gradient(32% 30% at 92% 92%, rgb(8 11 16 / 0.78), transparent 100%)' }}
      />
      {/* Vignette and a soft hand-off into the atlas section below. */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 95% at 55% 45%, transparent 52%, rgb(8 11 16 / 0.82) 100%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      <div className="grain absolute inset-0 opacity-70" />
    </div>
  )
}

/** Rhumb lines radiating from a compass rose, engraved in gold at very low opacity. */
function PortolanTexture() {
  const cx = 300
  const cy = 700
  const rays = Array.from({ length: 32 }, (_, i) => (i * Math.PI * 2) / 32)
  const far = 2400
  const ticks = Array.from({ length: 72 }, (_, i) => (i * Math.PI * 2) / 72)
  const star = (n: number, outer: number, inner: number, rot = 0) =>
    Array.from({ length: n * 2 }, (_, i) => {
      const a = rot + (i * Math.PI) / n - Math.PI / 2
      const rr = i % 2 ? inner : outer
      return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`
    }).join(' ')

  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.07] md:opacity-[0.085]"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMinYMax slice"
      style={{
        maskImage: 'radial-gradient(75% 85% at 20% 78%, #000 30%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(75% 85% at 20% 78%, #000 30%, transparent 85%)',
      }}
    >
      <g stroke="#c7a46a" fill="none">
        {rays.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * far}
            y2={cy + Math.sin(a) * far}
            strokeWidth={i % 4 === 0 ? 0.9 : 0.5}
            strokeDasharray={i % 2 ? '1 5' : undefined}
          />
        ))}
        <circle cx={cx} cy={cy} r={150} strokeWidth={0.8} />
        <circle cx={cx} cy={cy} r={140} strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={96} strokeWidth={0.5} strokeDasharray="2 4" />
        {ticks.map((a, i) => (
          <line
            key={`t${i}`}
            x1={cx + Math.cos(a) * 140}
            y1={cy + Math.sin(a) * 140}
            x2={cx + Math.cos(a) * (i % 9 === 0 ? 128 : 134)}
            y2={cy + Math.sin(a) * (i % 9 === 0 ? 128 : 134)}
            strokeWidth={0.6}
          />
        ))}
        <polygon points={star(8, 92, 22, Math.PI / 8)} strokeWidth={0.5} />
        <polygon points={star(4, 132, 26)} strokeWidth={0.9} />
        {/* Contour-like rings echoing an engraved plate. */}
        {[260, 380, 520, 680, 860].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} strokeWidth={0.4} strokeDasharray="1 7" />
        ))}
      </g>
      <text
        x={cx}
        y={cy - 162}
        textAnchor="middle"
        fill="#c7a46a"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="20"
        letterSpacing="4"
      >
        N
      </text>
    </svg>
  )
}
