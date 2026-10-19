const NOTES = [
  {
    title: 'Documentary material and historical context',
    text: 'Each story card keeps what Episode 4 shows or discusses separate from additional historical context. The documentary connection relies only on the PBS episode and its transcript; the wider background comes from the museums, encyclopedias and archives listed above.',
  },
  {
    title: 'Boundaries are approximate and dated',
    text: 'Borders changed many times. Historical boundaries such as the Pale of Settlement are simplified outlines labeled with the year they represent, and regions are marked at an approximate center.',
  },
  {
    title: 'Routes are generalized corridors',
    text: 'Lines on the map show common paths taken by many people over many years. They are not the journey of one person or one family, and the order of the chapters is not a single migration route.',
  },
  {
    title: 'Marked for verification',
    text: 'Where a detail could not be fully confirmed, the story card says so with a "Marked for verification" note instead of presenting it as settled fact.',
  },
  {
    title: 'A note on the transcript',
    text: 'PBS’s description of the episode mentions Uman and Rabbi Nachman’s tomb, but the narration in the available transcript never names them; it discusses Hasidism through the town of Satanov. The transcript also does not mention Ellis Island or Bremerhaven, and it names Hamburg only as a destination for timber, not as an emigration port. These places are included as historical context, and their descriptions rely on the historical sources rather than on the episode.',
  },
] as const

export function Methodology() {
  return (
    <ol className="grid gap-x-10 md:grid-cols-2">
      {NOTES.map((note, i) => (
        <li key={note.title} className="flex gap-5 border-t border-line py-6">
          <span aria-hidden="true" className="label pt-1.5 text-gold">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h4 className="font-serif text-[1.3rem] leading-snug text-parchment">{note.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-parchment/70">{note.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
