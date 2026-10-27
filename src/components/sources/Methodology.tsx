const NOTES = [
  {
    title: 'Documentary material and historical context',
    text: 'Each story card keeps what Episode 4 actually shows or says separate from extra historical background. The “Connection to the documentary” section only uses the PBS episode and its transcript. Everything else comes from the museums, encyclopedias and archives listed above.',
  },
  {
    title: 'Boundaries are approximate and dated',
    text: 'Borders changed a lot over time. Historical boundaries like the Pale of Settlement are shown as simplified outlines labeled with the year they represent, and regions are marked at an approximate center.',
  },
  {
    title: 'Routes are generalized corridors',
    text: 'The lines on the map show common routes that many people took over many years. They are not one person’s or one family’s journey, and the order of the chapters is not one single migration route either.',
  },
  {
    title: 'Marked for verification',
    text: 'When a detail couldn’t be fully confirmed, the story card says so in a "Marked for verification" note instead of presenting it as a fact.',
  },
  {
    title: 'A note on the transcript',
    text: 'PBS’s description of the episode mentions Uman and Rabbi Nachman’s tomb, but the narration in the available transcript never names them. It talks about Hasidism through the town of Satanov instead. The transcript also doesn’t mention Ellis Island or Bremerhaven, and it only names Hamburg as a place timber was shipped to, not as an emigration port. These places are still included as historical context, but what the atlas says about them comes from the historical sources, not from the episode.',
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
